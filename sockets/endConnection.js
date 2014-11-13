
module.exports.set = function(socket, io, db, redis_client) {	
	// when the user disconnects.. perform this
	socket.on('endconnection', function(data) {

// { room: '037acf77482d425aa93d0c77f0a89412',
//   user: 
//    { avatar: 'animals/cat_avatar_0083.jpg',
//      token: '2f680cd31dc75cef1fd4e74de97e0c23',
//      username: 'Ed' } }


		console.log(data)

		var roomKey = data.room;

		redis_client.hgetall(roomKey+":users", function(err, users) {

			if(users && users[data.user.token]) {

				redis_client.hdel(roomKey+":users", data.user.token);	

				//client_redis.decr(roomKey+":users:count");

				socket.leave(roomKey);

				redis_client.hgetall(roomKey+":users", function(err, users) {								
					data.users = users;							    				
					socket.broadcast.to(roomKey).emit('userdisconnected', data);	
					socket.leave(roomKey);
				});

				//socket.broadcast.to(rooms[data.rooms[room]]).emit('userdisconnected', { data : data } );							
			}
		});
		
		socket.emit('selfdisconnected', data);			
	});
}