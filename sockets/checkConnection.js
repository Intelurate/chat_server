module.exports.set = function(socket, data, client_redis, callback) {	
	// when the user disconnects.. perform this

		var roomKey = data.room;

		console.log(data);
		
		/*
		{ room: '2429dec0da16e05381d939035ea6cf86',
  user: { token: 'aea36dbea5d87bbf0fc2b8acbdb084c2', username: 'Eddie' },
  tabId: 44 }
		*/

		//client_redis.del(roomKey);


		client_redis.hgetall(roomKey+":users:"+data.user.token, function(err, user) {
			
			if(!user) {

				client_redis.hmset(roomKey+":users:"+data.user.token, data.user);
				client_redis.incr(roomKey+":users:count");
				client_redis.get(roomKey+":users:count", function(err, user_count) {

					data.count = user_count;
					socket.join(roomKey);
					socket.broadcast.to(roomKey).emit('userentersroom', data );	
					callback(roomKey, data);				

				});
			}else{

			}

		});

/*

		client_redis.get(roomKey, function(err, room) {

			if(!room) {

				var new_room = {		
					key : roomKey, 
					users : {} 
				};


			
				new_room.users[data.user.token] = data.user;  

		  		client_redis.set(roomKey, JSON.stringify(new_room));
		  		client_redis.setnx(roomKey+":count", 1);

		  		data.count = 1;		  		

				//sent to everyone but the client
				socket.join(roomKey);
				socket.broadcast.to(roomKey).emit('userentersroom', data );	

				callback(roomKey, data);
			


			}else{
				room = JSON.parse(room);
		  		if(!room.users[data.user.token]) { //this user
		  			room.users[data.user.token] = data.user;
	  				client_redis.setnx(roomKey+":count", 1);
	  				client_redis.incr(roomKey+":count");		  				  			
		  			client_redis.get(roomKey+":count", function(err, room_count) {

						data.count = room_count;						
						//sent to everyone but the client
						socket.join(roomKey);	
						socket.broadcast.to(roomKey).emit('userentersroom', data );
					    callback(roomKey, data);

		  			});

				}else{

					client_redis.get(roomKey+":count", function(err, room_count) {	

						data.count = room_count;
						socket.join(roomKey);						 
					    callback(roomKey, data);
				    });				
				}

		  		client_redis.set(roomKey, JSON.stringify(room));

			}

		});


*/

	/*

	if(!rooms[data.room]) {
		rooms[data.room] = { room : data.room };
		rooms[data.room].users = {};
	}

	if(!rooms[data.room].users[data.user.token]) {

		rooms[data.room].users[data.user.token] = data.user;  			
		
		if(rooms[data.room].count) {
			rooms[data.room].count = (rooms[data.room].count + 1)			
		}else{
			rooms[data.room].count = 1;			
		}		
		
		data.count = rooms[data.room].count;
		//sent to everyone but the client
		socket.broadcast.to(data.room).emit('userentersroom', data );	
	}else{
		data.count = rooms[data.room].count;
	}

	socket.join(rooms[data.room].room);

	*/

}