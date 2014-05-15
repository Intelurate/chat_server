var getCurrentConnections = require('./getCurrentConnections');
var getUrlConnections = require('./getUrlConnections');
var addUser = require('./addUser');
var sendChat = require('./sendChat');
var disconnect = require('./disconnect');

var changeConnection = require('./changeConnection');

module.exports.set = function(io, db, connection, sanitizer, md5) {

	var rooms = {};

	io.sockets.on('connection', function (socket) {

		console.log(socket);


		getCurrentConnections.set(socket, io, rooms);
		addUser.set(socket, io, db, rooms, sanitizer, connection);
		sendChat.set(socket, io, db, sanitizer, connection);
		getUrlConnections.set(socket, rooms);
		disconnect.set(socket, io, rooms, connection);

		changeConnection.set(socket, io, rooms, connection);

		//db.collection('room1', function(err, collection) {
		//    collection.remove();
		//});

		socket.on('gettrendingconnections', function() {

			var trending = [
				{ url : "https://www.yahoo.com/", visits : 30 },
				{ url : "https://www.google.com/", visits : 46 }			
			];

			socket.emit('showtrendingconnections', trending);

		});


	});

}