// create an express app
const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
//const server  = app.listen(2095);

///////const io = require('socket.io')(server);
//const io = require('socket.io').listen(server);
//const io = require('socket.io').listen();

const socketio = require('socket.io');

const io = socketio(server, {
    cors: {
        origin: `https://dj-clique-chatroom-new.herokuapp.com/`, // I copied the origin in the error message and pasted here
        methods: ["GET", "POST"],
        credentials: true
      }
});



const fs = require('fs');

const path = require('path');
 

// use the express-static middleware
//app.use(express.static("public"))
//app.use(express.static(__dirname + '/public'));




//////app.use('/public', express.static(path.join(__dirname, "public")));
 


//app.use(express.static(__dirname + '/static'));
app.use('/static', express.static(path.join(__dirname, "static")));
 

// define the first route
//app.get("/", function (req, res) {
 // res.send("<h1>Hello World!</h1>")
//})








// routing

app.get('/', function (req, res) {

  res.sendFile(path.join(__dirname + '/index.html'));

});






// usernames which are currently connected to the chat

var usernames = {};



// rooms which are currently available in chat

var rooms = ['DJ Clique','Lobby','Admin','VIP'];














io.sockets.on('connection', function (socket) {




//------------------------------------------------------
/**

 * Get the value of a querystring

 * @param  {String} field The field to get the value of

 * @param  {String} url   The URL to get the value from (optional)

 * @return {String}       The field value

 */

var referer = socket.request.headers.referer;


var getQueryString = function ( field, url ) {

    var href = url ? url : referer;

    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );

    var string = reg.exec(href);

    return string ? string[1] : null;

};



	var thisOne = getQueryString('room'); 
	var myUserId = getQueryString('userid'); 


//var thisOne = 'test';
//var myUserId = 1234;

//alert(thisOne);

//---------------------------------------------------------


	//console.log (thisOne);
	rooms.push(thisOne);

//========================================================================================


	// when the client emits 'adduser', this listens and executes

	socket.on('adduser', function(username){

		// store the username in the socket session for this client

		socket.username = username;

		// store the room name in the socket session for this client

		socket.room = 'Main Lobby';

		// add the client's username to the global list

		usernames[username] = username;

		// send client to room 1

		//socket.join('room1');
		socket.join(thisOne);

		// echo to client they've connected

		socket.emit('updatechat', 'SERVER', 'you have connected to DJ Clique');

		// echo to room 1 that a person has connected to their room

		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');

		socket.emit('updaterooms', rooms, 'room1');

	});


//========================================================================================
	
  
 

	// when the client emits 'sendchat', this listens and executes

	socket.on('sendchat', function (data) {

		// we tell the client to execute 'updatechat' with 2 parameters

		io.sockets.in(socket.room).emit('updatechat', socket.username, data)

	});


//========================================================================================
	

	socket.on('switchRoom', function(newroom){

		///////////socket.leave(socket.room);

		socket.join(newroom);

		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);

		// sent message to OLD room

		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');

		// update socket session room title

		socket.room = newroom;

		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');

		socket.emit('updaterooms', rooms, newroom);

	});


//========================================================================================	



	// when the user disconnects.. perform this

	socket.on('disconnect', function(){

		// remove the username from global usernames list

		delete usernames[socket.username];

		// update list of users in chat, client-side

		io.sockets.emit('updateusers', usernames);

		// echo globally that this client has left

		//socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');

		socket.leave(socket.room);

	});

});

//========================================================================================
//========================================================================================

/*
// trying to serve the image file from the server

io.on('connection', function(socket){

  fs.readFile(__dirname + '/images/image.jpg', function(err, buf){

    // it's possible to embed binary data

    // within arbitrarily-complex objects

    socket.emit('image', { image: true, buffer: buf });

    console.log('image file is initialized');

  });

});
*/













// start the server listening for requests
app.listen(process.env.PORT || 80, 
	() => console.log("Server is running..."));








