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

// ws event
// socket: 클라이언트와 연결된 소켓 객체
// on: 이벤트 리스너 == addEventListener
wss.on("connection", (socket) => {
  console.log("✅ Connected to the browser");
  socket.send("Welcome to the server");

  socket.on("message", (message) => {
    console.log(message.toString("utf8"));
  });

  socket.on("close", () => {
    console.log("❌ Disconnected from the browser");
  });
});

// http, ws protocol
server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
