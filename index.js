const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const { ExpressPeerServer } = require("peer");

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// PeerJS Server
const peerServer = ExpressPeerServer(server, {
  path: "/peerjs", // Ensure this matches the path used in the frontend
});

// const peerServer = PeerServer({ path: "/peerjs" }); // Remove port here

app.use("/peerjs", peerServer);

// Handle socket connections
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

app.get('/',(req,res)=>{
  res.send('Hello World')
})

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
