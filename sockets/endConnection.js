
module.exports.set = function(socket, io, db, client_redis) {	
	// when the user disconnects.. perform this
	socket.on('endconnection', function(data) {

		if(data.rooms) {
			for(room in data.rooms) {
				var roomKey = data.rooms[room];
				client_redis.hgetall(roomKey+":users", function(err, users) {
					if(users && users[data.user.token]) {
						client_redis.hdel(roomKey+":users", data.user.token);	
						client_redis.decr(roomKey+":users:count");
						socket.broadcast.to(roomKey).emit('userdisconnected', { data : data } );	
						socket.leave(roomKey);

						//socket.broadcast.to(rooms[data.rooms[room]]).emit('userdisconnected', { data : data } );							
					}
				});
			}
			socket.emit('selfdisconnected', { data : data } );			
		}

	});

}