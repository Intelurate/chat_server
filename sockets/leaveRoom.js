

module.exports.set = function(socket, io, redis_client) {

	socket.on('leaveroom', function(data) {

		if(data.room) {

			var roomKey = data.room;

			console.log('leave room');

			if(data.user.token) {

				redis_client.hdel(roomKey+":users", data.user.token);				
				redis_client.decr(roomKey+":users:count");
				socket.leave(roomKey);
				redis_client.get(roomKey+":users:count", function(err, room_count) {
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