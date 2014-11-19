
//var Worker = require('webworker-threads').Worker;

module.exports.set = function(socket, io, redis_client) {	
	// when the user disconnects.. perform this
	socket.on('disconnect', function() {	
	
		var roomKey = socket.room_key;

		redis_client.hgetall(roomKey+":users", function(err, users) {

			if(users) {
				var data = {};
				if(users[socket.user_token]) {
					console.log(socket.user_token);
					data.left_user = users[socket.user_token];
					redis_client.hdel(roomKey+":users", socket.user_token);
					delete users[socket.user_token];
				}
				
				if(Object.keys(users).length !== 0) {
					//redis_client.hmset(roomKey+":users", users);								
					data.users = users;
					console.log("USER LEFT ROOM");
					console.log(roomKey);

					socket.broadcast.to(roomKey).emit('showuserlist', data);	
					socket.broadcast.to(roomKey).emit('userleftroom', data );
				}

				socket.leave(roomKey);
			}
	    });	


		/*
		var worker = new Worker(function() {

			var now = new Date().getTime();
			while(new Date().getTime() < now + 10000) {}				
			this.postMessage('I am done processing now');
			console.log("while done");

		});

		worker.onmessage = function(event) {
			console.log(event.data);
		};
		*/

		/*
		if(rooms) {
			if(rooms[socket.room]) {
				if(rooms[socket.room]['users']) {
					if(rooms[socket.room]['users'][socket.user.token]) {

						delete rooms[socket.room]['users'][socket.user.token];
						// remove the username from global rooms list
						rooms[socket.room]['count'] = (rooms[socket.room]['count']-1);
						
						// update list of users in chat, client-side
						//io.sockets.emit('updateusers', rooms);

						var d = new Date();
						var currMills = d.getTime();
						//sets the 
						//connection.query('UPDATE guests set page_leave_time="'+currMills+'" where guest_socket_id="'+socket.user_id+'"');

						// echo globally that this client has left				
						socket.broadcast.to(socket.room).emit('userdisconnected', socket.user, rooms[socket.room] );						
						socket.broadcast.to(socket.room).emit('showuserlist', rooms[socket.room].users);
						socket.leave(socket.room);


					}
				}
			}
		}
		*/

		
	});
}