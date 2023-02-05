'use strict';
const express = require('express');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = require("socket.io")(server,{
  cors: {
    origins: "*:*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('messaged', (args) => {
    io.emit('message', args);
    console.log(args)
  });
});
//========================================================================================


/*
var express = require('express')

  , app = express()

  , http = require('http')

  , server = http.createServer(app)

  , io = require('socket.io').listen(server);

//var io = io("socket-lb02.onrender.com", {transports: ['websocket']});


//const io = require('socket.io');

const PORT = process.env.PORT || 3000;
//server.listen(PORT);
server.listen(PORT, () => console.log(`Listening on ${PORT}`));




// routing

app.get('/', function (req, res) {

  res.sendFile(__dirname + '/index.html');

});

*/
	
