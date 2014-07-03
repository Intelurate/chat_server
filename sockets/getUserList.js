
module.exports.set = function(socket, io, rooms) {

	socket.on('getuserlist', function(data) {
		if(rooms[data.room]) {
			socket.emit('showuserlist', rooms[data.room].users);			
		}
	});
	
}