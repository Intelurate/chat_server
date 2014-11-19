module.exports.set = function(socket, io, db, redis_client) {	
	// when the user disconnects.. perform this

	socket.on('startconnection', function(data) {

		var roomKey = data.room;

		redis_client.hgetall(roomKey+":users", function(err, users) {

			var userSet = {};
			userSet[data.user.token] = data.user.username;

			console.log("user set");
			console.log(userSet);
			redis_client.hmset(roomKey+":users", userSet);

			socket.join(roomKey);
			socket.user_token = data.user.token;
			socket.room_key = roomKey;

		    db.collection(roomKey, function(err, collection) {
		        collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {

		        	data.items = items;

					redis_client.hgetall(roomKey+":users", function(err, users) {
					
						data.users = users;						

						//socket.broadcast.to(roomKey).emit('userentersroom', data);						
    					// io.sockets.in(roomKey).emit('showuserlist', data);
			      //      	io.to(roomKey).emit('verifyconnection', data );


					    socket.broadcast.to(roomKey).emit('userentersroom', data);			
						
						//io.to(roomKey).emit('showuserlist', data);
						io.sockets.in(roomKey).emit('showuserlist', data);				
					    
					    socket.emit('verifyconnection', data );	


           			});
		        })
		    });	



			// console.log("USERS:");
			// console.log(users);

			// //sets the users room token
			// if(!users) {

			// 	var userSet = {};
			// 	userSet[data.user.token] = data.user.username;

			// 	console.log("user set");
			// 	console.log(userSet);
			// 	redis_client.hmset(roomKey+":users", userSet);

			// 	socket.join(roomKey);
			// 	socket.user_token = data.user.token;
			// 	socket.room_key = roomKey;

			//     db.collection(roomKey, function(err, collection) {
			//         collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {

			//         	data.items = items;

			// 			redis_client.hgetall(roomKey+":users", function(err, users) {
						
			// 				data.users = users;						

			// 				//socket.broadcast.to(roomKey).emit('userentersroom', data);						
	  //   					io.sockets.in(roomKey).emit('showuserlist', data);
			// 	           	io.to(roomKey).emit('verifyconnection', data );

	  //          			});
			//         })
			//     });	
			
			// }else{


			// 	socket.join(roomKey);
			// 	socket.user_token = data.user.token;
			// 	socket.room_key = roomKey;

			// 	var userSet = {};
			// 	userSet[data.user.token] = data.user.username;
			// 	console.log("user set 2");
			// 	console.log(userSet);
			// 	redis_client.hmset(roomKey+":users", userSet);

			//     db.collection(roomKey, function(err, collection) {

			//         collection.find().sort( { "created" : -1 } ).limit(20).toArray(function(err, items) {
			        	
			//         	data.items = items;	

			// 			redis_client.hgetall(roomKey+":users", function(err, users) {								

			// 				data.users = users;							    

			// 				console.log('send message user entered room');
			// 				console.log(roomKey);

			// 			    socket.broadcast.to(roomKey).emit('userentersroom', data);			
		
			// 				//io.to(roomKey).emit('showuserlist', data);

			// 				io.sockets.in(roomKey).emit('showuserlist', data);				

			// 			    io.to(roomKey).emit('verifyconnection', data );	
			// 			});				     
			//         })
			//     });	

			// }




		});
	});
}

