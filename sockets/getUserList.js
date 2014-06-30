
module.exports.set = function(socket, io, rooms) {

	socket.on('getuserlist', function(data) {
		socket.emit('showuserlist', rooms[data.room].users);			
	});
	
}