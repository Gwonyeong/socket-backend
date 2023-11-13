const app = require("express");
const server = require("http").createServer(app);
const cors = require("cors");
const socketIo = require("socket.io");
const io = new socketIo.Server(server, {
  cors: {
    origin: "*",
  },
});

const database = [];

server.listen(8000, function () {
  console.log("Socket IO server listening on port 8000");
});

io.on("connection", function (socket) {
  console.log(socket.id);

  socket.on("disconnect", function () {
    console.log("Disconnected from client");
  });
});

const chat = io.of("/chat").on("connection", function (socket) {
  console.log(socket.id);

  socket.on("disconnect", function () {
    console.log("Disconnected from chat namespace");
  });

  socket.on("join", function (room) {
    console.log(room);
    console.log(room.roomId);
    socket.join(room.roomId);
    // socket.emit("joined", room.roomId);
    chat.to(room.roomId).emit("joined", socket.client.id);
  });

  socket.on("send-message", function (message) {
    console.log(message);
    database.push({
      roomId: message.roomId,
      message: message.message,
      userId,
    });
    chat.to(message.roomId).emit("send-message", message);
  });
});
