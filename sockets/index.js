var redis = require("redis"),
    client_redis = redis.createClient(6379, '127.0.0.1', {});

var startConnection = require('./startConnection');
var endConnection = require('./endConnection');

var getCurrentConnections = require('./getCurrentConnections');
var getUserList = require('./getUserList');

var leaveRoom = require('./leaveRoom');


var getUrlConnections = require('./getUrlConnections');
var addUser = require('./addUser');
var sendChat = require('./sendChat');
var getPage = require('./getPage');
var disconnect = require('./disconnect');
var changeConnection = require('./changeConnection');

module.exports.set = function(io, db, sanitizer) {


	io.sockets.on('connection', function (socket) {

		startConnection.set(socket, io, db, client_redis);

		sendChat.set(socket, io, db, sanitizer, client_redis);	

		leaveRoom.set(socket, io, client_redis);
		
		getPage.set(socket, io, db, client_redis);

		getUserList.set(socket, io, client_redis);
	
		endConnection.set(socket, io, db, client_redis);


		/*
		
		getUserList.set(socket, io, rooms);

		*/

		/*
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