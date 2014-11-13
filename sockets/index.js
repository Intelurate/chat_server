var redis = require("redis");
var redis_client = redis.createClient(6379, '127.0.0.1', {});
var startConnection = require('./startConnection');
var endConnection = require('./endConnection');
var getUserList = require('./getUserList');
var leaveRoom = require('./leaveRoom');
var getUserConnections = require('./getUserConnections');
var sendChat = require('./sendChat');
var getPage = require('./getPage');
var disconnect = require('./disconnect');

module.exports.set = function(io, db, sanitizer) {

	io.on('connection', function (socket) {

		console.log(socket);

		startConnection.set(socket, io, db, redis_client);		
		sendChat.set(socket, io, db, sanitizer);	
		getPage.set(socket, io, db, redis_client);


		/*
		leaveRoom.set(socket, io, redis_client);				
		getUserList.set(socket, io, redis_client);		
		getUserConnections.set(socket, io, redis_client);
		*/
			
		disconnect.set(socket, io, redis_client);
		endConnection.set(socket, io, db, redis_client);




	
		/*		
		getUserList.set(socket, io, rooms);
		getCurrentConnections.set(socket, io, rooms);
		getUserList.set(socket, io, rooms);
		addUser.set(socket, io, db, rooms, sanitizer);
		
		getUrlConnections.set(socket, rooms);
		getPage.set(socket, db, rooms);
		disconnect.set(socket, io, rooms);		
		changeConnection.set(socket, io, rooms);
		*/

		//db.collection('room1', function(err, collection) {
		//    collection.remove();
		//});
		/*
		socket.on('gettrendingconnections', function() {

			var trending = [
				{ url : "https://www.yahoo.com/", visits : 30 },
				{ url : "https://www.google.com/", visits : 46 }			
			];

			socket.emit('showtrendingconnections', trending);

		});
		*/
	});
}

