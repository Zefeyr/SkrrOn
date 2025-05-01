// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Handle input from user
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('input', (data) => {
    console.log(`🎮 Received input from ${socket.id}:`, data);
    // Next: Inject this input into the game window
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Input server running at http://localhost:${PORT}`);
});
