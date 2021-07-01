const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { transports: ['websocket'] });

io.on('connection', (socket) => {
  socket.on('sendFriReq', (data) => {
    io.sockets.emit('addFriReq', data)
  })
  socket.on('accFriNoti', (data) => {
    io.sockets.emit('accFri', data)
  })
  socket.on('rejFriNoti', (data) => {
    io.sockets.emit('rejFri', data)
  })
  socket.on('sendMessage', (data) => {
    io.sockets.emit('sendMsg', data)
  })
  socket.on("comShare", (data) => {
    io.sockets.emit("sendShare", data)
  })
});

server.listen(8082, '127.0.0.1', () => {
  console.log('socket.io is running at port 8082');
})
