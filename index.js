const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log('socketid', socket.id);
  socket.on("join-room", (roomID, peerID) => {
    socket.join(roomID);
    socket.in(roomID).emit("user-connected", peerID);

    socket.on("disconnect", () => {
      socket.in(roomID).emit("user-disconnected", peerID);
    });
  });
});



// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
