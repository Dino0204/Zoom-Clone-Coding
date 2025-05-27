const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

const room = document.querySelector("#room");
room.hidden = true;

let roomName;

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;

  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;

  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");

  msgForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = msgForm.querySelector("input");
    // emit은 비동기 함수이기 때문에 input.value를 비우기 전에 저장 후 전송해야 함
    const value = input.value;

    socket.emit("new_message", input.value, roomName, () => {
      addMessage(`You: ${value}`);
    });
    input.value = "";
  });

  nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = nameForm.querySelector("input");
    // emit은 비동기 함수이기 때문에 input.value를 비우기 전에 저장 후 전송해야 함
    const value = input.value;

    socket.emit("nickname", input.value);
  });
};

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);

  roomName = input.value;

  input.value = "";
});

socket.on("welcome", (nickname, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${newCount})`;
  addMessage(`${nickname} joined!`);
});

socket.on("bye", (nickname, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${newCount})`;
  addMessage(`${nickname} left ㅠㅠ!`);
});

socket.on("new_message", (message) => {
  addMessage(message);
});

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";

  if (rooms.length === 0) {
    return;
  }

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  });
});
