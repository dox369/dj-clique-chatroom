//========================================================================================
//========================================================================================
//========================================================================================
//========================================================================================

var express = require('express')

  , app = express()

  , http = require('http')

  , server = http.createServer(app)

  //, io = require('socket.io').listen(server);

//var io = io("socket-lb02.onrender.com", {transports: ['websocket']});


const io = require('socket.io');

const PORT = process.env.PORT || 3000;
//server.listen(PORT);
server.listen(PORT, () => console.log(`Listening on ${PORT}`));


// routing

app.get('/', function (req, res) {

  res.sendFile(__dirname + '/index.html');

});



// usernames which are currently connected to the chat

var usernames = {};



// rooms which are currently available in chat

var rooms = ['DJ Clique','Lobby','Admin','VIP'];

//var roomId = 
//rooms.push(roomId);


//========================================================================================



//rooms.push(roomId)



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

		io.sockets.in(socket.room).emit('updatechat', socket.username, data);

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
