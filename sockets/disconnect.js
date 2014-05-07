
module.exports.set = function(socket, io, rooms) {	
	// when the user disconnects.. perform this
	socket.on('disconnect', function() {
		if(rooms) {
			if(rooms[socket.room]) {
				if(rooms[socket.room]['users']) {

					if(rooms[socket.room]['users'][socket.username]) {
						
						delete rooms[socket.room]['users'][socket.username];
						// remove the username from global rooms list
						rooms[socket.room]['count'] = (rooms[socket.room]['count']-1);
						// update list of users in chat, client-side
						io.sockets.emit('updateusers', rooms);
						// echo globally that this client has left				
						socket.broadcast.to(socket.room).emit('userdisconnected', socket.username, rooms[socket.room] );
						socket.leave(socket.room);
					}
				}
			}
		}
	});
}