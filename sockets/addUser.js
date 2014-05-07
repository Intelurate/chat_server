module.exports.set = function(socket, io, db, rooms, sanitizer) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(data) {

		// add the client's username to the global list
		if(!rooms[socket.room]) {
			rooms[socket.room] = {};
			rooms[socket.room]['count'] = 0;
			rooms[socket.room]['users'] = {};
		}

		//testing username
		if(rooms[socket.room][sanitizer.escape(data.username)]) {
			socket.emit('usernameliveexist', true);
		}else{
			
			socket.username = sanitizer.escape(data.username);
			rooms[socket.room]['users'][socket.username] = {}; //sanitizer.escape(data.username);
			
			rooms[socket.room]['count'] = (rooms[socket.room]['count']+1);

			socket.emit('showyourconnected', socket.username, rooms[socket.room]);

			// echo to room that a person has connected to their room
			socket.broadcast.to(socket.room).emit('shownewuser', socket.username, rooms[socket.room]);		
			//socket.emit('updaterooms', rooms, socket.room);

		    db.collection(socket.room, function(err, collection) {
		        collection.find().sort( { "created" : -1 } ).toArray(function(err, items) {
		            socket.emit('getsavedchat', socket.username, items, rooms[socket.room]);
		        });
		    });
		}
	});
}