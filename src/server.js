import http from "http";
// import WebSocket from "ws";
import { Server } from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});

// http server -> views, static files, home, redirection
const httpServer = http.createServer(app);

const wsServer = new Server(httpServer);

const publicRooms = () => {
  // sids: socket id
  // rooms: rooms id (sids와 같을 수 있다 -> private room)
  const { sids, rooms } = wsServer.sockets.adapter;

  // private rooms를 제외한 rooms
  const publicRooms = [];

  // sids: socket id -> room id
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
};

wsServer.on("connection", (socket) => {
  wsServer.sockets.emit("room_change", publicRooms());
  socket["nickname"] = "Anonymous";

  console.log(wsServer.sockets.adapter);

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname);
    });
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_message", (message, roomName, done) => {
    socket.to(roomName).emit("new_message", `${socket.nickname}: ${message}`);
    done();
  });

  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});

// http, ws protocol
httpServer.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
