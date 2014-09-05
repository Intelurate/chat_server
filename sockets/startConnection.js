
var checkConnection = require('./checkConnection');

module.exports.set = function(socket, io, db, redis_client) {	
	// when the user disconnects.. perform this

	socket.on('startconnection', function(data) {

		var roomKey = data.room;

		redis_client.hgetall(roomKey+":users", function(err, users) {

			//sets the users room token
			if(!users || !users[data.user.token]) {

				var userSet = {};

				userSet[data.user.token] = data.user.username;
				redis_client.hmset(roomKey+":users", userSet);
				redis_client.incr(roomKey+":users:count");


				redis_client.get(roomKey+":users:count", function(err, user_count) {

					data.count = user_count;
					socket.join(roomKey);

					socket.broadcast.to(roomKey).emit('userentersroom', data);

					redis_client.hgetall(roomKey+":users", function(err, users) {
						data.users = users;						
    					io.sockets.in(roomKey).emit('showuserlist', data);
           			});

				    db.collection(roomKey, function(err, collection) {
				        collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {
				        	data.items = items;
				           	io.to(data.room).emit('verifyconnection', { data : data } );
				        })
				    });	
				});
			
			}else{

				redis_client.get(roomKey+":users:count", function(err, user_count) {
					
					if(!user_count){
						redis_client.incr(roomKey+":users:count");
						data.count = 1;
					}else{
						data.count = user_count;
					}
					
					
					if(!io.sockets.adapter.rooms[roomKey]) {
						socket.join(roomKey);								
						console.log('joins room!!!');
					}else{
						console.log('already in room!!!');
					}


				    db.collection(roomKey, function(err, collection) {
				    	
				        collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {
				        	
				        	data.items = items;	

		           			io.to(roomKey).emit('verifyconnection', { data : data } );		           			
		           	
		           			//socket.broadcast.to(roomKey).emit('verifyconnection', { data : data } );

							redis_client.hgetall(roomKey+":users", function(err, users) {
								data.users = users;
							    io.to(data.room).emit('showuserlist', data);							 
							});				     
				        })
				    });												
				});
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
				socket.broadcast.to(roomKey).emit('userentersroom', data );	

			    db.collection(roomKey, function(err, collection) {
			        collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {
			        	data.items = items;	 
			           	socket.to(data.room).emit('verifyconnection', { data : data } );
			        })
			    });


			}else{

				room = JSON.parse(room);

		  		if(!room.users[data.user.token]) { //this user
		  			room.users[data.user.token] = data.user;
	  				client_redis.setnx(roomKey+":count", 1);
	  				client_redis.incr(roomKey+":count");		  				  			
		  			client_redis.get(roomKey+":count", function(err, room_count) {			  				

						data.count = room_count;
						//sent to everyone but the client
						socket.broadcast.to(roomKey).emit('userentersroom', data );	

					    db.collection(roomKey, function(err, collection) {
					        collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {
					        	data.items = items;	 
					           	socket.to(data.room).emit('verifyconnection', { data : data } );
					        })
					    });

		  			});
				}else{

					client_redis.get(roomKey+":count", function(err, room_count) {	
						data.count = room_count;
					    db.collection(roomKey, function(err, collection) {
					        collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {
					        	data.items = items;	 
					           	socket.to(data.room).emit('verifyconnection', { data : data } );
					        })
					    });	
				    });				
				}


				socket.join(room.key);

		  		client_redis.set(roomKey, JSON.stringify(room));

			}

		});

		*/
		//checkConnection.set(socket, data, client_redis);

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
			//socket.broadcast.to(rooms[data.room].room).emit('shownewuser', { data : data } );	

		}else{
			data.count = rooms[data.room].count;
		}

		socket.join(rooms[data.room].room);
		*/

		//socket.join("hello_room");		
		//this goes to the person connected to the socket
		//socket.emit('verify_connection', { data : 'test' } );

		//this goes to everyone connected to the room except the person who initilized it
		//socket.broadcast.to(socket.rooms[data.room]).emit('verify_connection', { data : 'test' } );	


		//pushes to everyone in this room
		//io.sockets.in(socket.rooms[data.room].room).emit('verifyconnection', { data : data });


		//socket.broadcast.to("2429dec0da16e05381d939035ea6cf86").emit('verify_connection', { data : 'test' } );		
		//socket.to(socket.room).emit('verify_connection', { data : 'test' } );	

		//this goes out to everyone on the socket. Super global emit. doesnt care about rooms
		//io.sockets.emit('verify_connection', { data : 'test' });


	});
}