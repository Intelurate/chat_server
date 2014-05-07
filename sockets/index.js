var getCurrentConnections = require('./getCurrentConnections');
var getUrlConnections = require('./getUrlConnections');
var addUser = require('./addUser');
var sendChat = require('./sendChat');

var disconnect = require('./disconnect');


module.exports.set = function(io, db, sanitizer) {

	var rooms = {};

	io.sockets.on('connection', function (socket) {

		getCurrentConnections.set(socket, io, rooms);
		addUser.set(socket, io, db, rooms, sanitizer);
		sendChat.set(socket, io, db, sanitizer);
		getUrlConnections.set(socket, rooms);
		disconnect.set(socket, io, rooms);

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