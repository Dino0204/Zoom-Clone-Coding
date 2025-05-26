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
// on: 이벤트 리스너
const handleConnection = (socket) => console.log("User connected");
wss.on("connection", handleConnection);

// http, ws protocol
const handleListen = () => console.log("Listening on http://localhost:3000");
server.listen(3000, handleListen);
