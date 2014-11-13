module.exports.set = function(socket, io, db, redis_client) {	
	// when the user disconnects.. perform this

	socket.on('startconnection', function(data) {

		console.log(data);

		var roomKey = data.room;

		redis_client.hgetall(roomKey+":users", function(err, users) {

			//sets the users room token
			if(!users || !users[data.user.token]) {

				var userSet = {};

				userSet[data.user.token] = data.user.username;

				redis_client.hmset(roomKey+":users", userSet);

				//redis_client.incr(roomKey+":users:count");

				// redis_client.get(roomKey+":users:count", function(err, user_count) {
				// 	data.count = user_count;

// { data: 
//    { room: '037acf77482d425aa93d0c77f0a89412',
//      user: 
//       { avatar: 'animals/cat_avatar_0083.jpg',
//         token: '2f680cd31dc75cef1fd4e74de97e0c23',
//         username: 'Ed' } } }


					socket.join(roomKey);
				    db.collection(roomKey, function(err, collection) {
				        collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {

				        	data.items = items;

							redis_client.hgetall(roomKey+":users", function(err, users) {
							
								data.users = users;						
								socket.broadcast.to(roomKey).emit('userentersroom', data);						
		    					io.sockets.in(roomKey).emit('showuserlist', data);
					           	io.to(data.room).emit('verifyconnection', data );

		           			});

				        })
				    });	

				//});
			
			}else{

				redis_client.get(roomKey+":users:count", function(err, user_count) {
					
					if(!user_count){
						redis_client.incr(roomKey+":users:count");
						data.count = 1;
					}else{
						data.count = user_count;
					}
					
	
					//needs to be fixed
					socket.join(roomKey);

				    db.collection(roomKey, function(err, collection) {

				        collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {
				        	
				        	data.items = items;	


		           			//io.to(roomKey).emit('verifyconnection', { data : data } );		           					       
		           			//socket.broadcast.to(roomKey).emit('verifyconnection', { data : data } );

							redis_client.hgetall(roomKey+":users", function(err, users) {								
								data.users = users;							    
							    
							    io.to(roomKey).emit('showuserlist', data);		
							    
							    console.log('sho wuser lsit');

		    					//io.sockets.in(roomKey).emit('showuserlist', data);

							    io.to(roomKey).emit('verifyconnection', data );	
							});				     
				        })
				    });												
				});
			}
		});
	});
}

