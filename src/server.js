import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});

// http server -> views, static files, home, redirection
const server = http.createServer(app);

// websocket server -> real-time communication
const wss = new WebSocket.Server({ server });

// fake db
const sockets = [];

// ws event
// socket: 클라이언트와 연결된 소켓 객체
// on: 이벤트 리스너 == addEventListener
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("✅ Connected to the browser");

  socket.on("message", (msg) => {
    // Broadcast the message to all connected sockets
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) => {
          aSocket.send(`${socket.nickname}: ${message.payload}`);
        });
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
      default:
        throw new Error(`Unknown type: ${message.type}`);
    }
  });

  socket.on("close", () => {
    console.log("❌ Disconnected from the browser");
  });
});

// http, ws protocol
server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
