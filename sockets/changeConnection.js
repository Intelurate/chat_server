
module.exports.set = function(socket, io, rooms) {	
	// when the user disconnects.. perform this
	socket.on('changeconnection', function(data) {

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
						socket.emit('userchanged', socket.user, rooms[socket.room] );
						socket.emit('showuserlist', rooms[socket.room].users );

						socket.broadcast.to(socket.room).emit('userdisconnected', socket.user, rooms[socket.room] );						

						socket.broadcast.to(socket.room).emit('showuserlist', rooms[socket.room].users  );									
					}
				}
			}
		

			if(data) {
				if(data.room) {
					socket.leave(socket.room);
					
					socket.room = data.room;
					socket.join(socket.room);

					if(rooms[data.room]) {
						socket.emit('showcurrentconnections', rooms[data.room].count);
					}else{
						socket.emit('showcurrentconnections', 0);
					}								
				}
			}	
		
		}
	});
}