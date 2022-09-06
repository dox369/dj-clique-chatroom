'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const path = require('path');
 
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const app = express()

const io = socketIO(server);


io.use('/static', express.static(path.join(__dirname, "static")));
 io.use('/socket.io', express.static(path.join(__dirname, "socket.io")));
 io.use('/javascripts', express.static(path.join(__dirname, "javascripts")));
io.use('/stylesheets', express.static(path.join(__dirname, "stylesheets")));
 




io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});




setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
