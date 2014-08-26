

module.exports.set = function(socket, io, client_redis) {

	socket.on('leaveroom', function(data) {

		if(data.room) {

			var roomKey = data.room;

			console.log('leave room');

			if(data.user.token) {

				client_redis.hdel(roomKey+":users", data.user.token);				
				client_redis.decr(roomKey+":users:count");
				socket.leave(roomKey);
				client_redis.get(roomKey+":users:count", function(err, room_count) {
					data.count = room_count;
					socket.broadcast.to(data.room).emit('userleftroom', data );
			    });	
			}else{
				console.log('user token not found');
			}
		}else{
			console.log('room not found')
		}

	});
}