const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let lastMessages = {};

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('chat-message', ({ sender, receiver, message }) => {
    if (lastMessages[sender]) {
      io.to(lastMessages[sender]).emit('delete-last');
    }

    lastMessages[sender] = socket.id;

    io.emit('new-message', { sender, message });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => console.log('Socket.IO server running'));
