

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
		var token = sanitizer.escape(data.user.token);
		if(rooms[socket.room]['users'][token]) {
			socket.emit('usernameliveexist', true);
		} else {
		
			socket.user = { username : sanitizer.escape(data.user.username), token : token };
			rooms[socket.room]['users'][socket.user.token] = socket.user;
			rooms[socket.room]['count'] = (rooms[socket.room]['count']+1);
			socket.emit('showyourconnected', socket.user, rooms[socket.room]);

			// echo to room that a person has connected to their room
			socket.broadcast.to(socket.room).emit('shownewuser', socket.user, rooms[socket.room]);		

			//socket.emit('updaterooms', rooms, socket.room);
			
		    db.collection(socket.room, function(err, collection) {
		        collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {
		            socket.emit('getsavedchat', socket.user, items, rooms[socket.room]);					
					io.sockets.in(socket.room).emit('showuserlist', rooms[socket.room].users );
		        })
		    });
			

			//connection.query('INSERT into guests (guest_name, page_enter_time, guest_socket_id) values("'+socket.username+'", "'+currMills+'", "'+socket.user_id+'")', function(err, rows) {
			//	console.log(rows);
			//});
		
		}
	});
}