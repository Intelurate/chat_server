
module.exports.set = function(socket, io, rooms) {

	socket.on('getcurrentconnections', function(data) {

		socket.room = data.room;
		socket.join(socket.room);

		if(rooms[data.room]) {
			socket.emit('showcurrentconnections', rooms[data.room]);
		}else{
			socket.emit('showcurrentconnections', 0);
		}
	});
	
}