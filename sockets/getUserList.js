

module.exports.set = function(socket, io, client_redis) {

	socket.on('getuserlist', function(data) {
		var roomKey = data.room;
		client_redis.hgetall(roomKey+":users", function(err, users) {
			data.users = users;
			socket.emit('showuserlist', data);		
	    });	
	});
}