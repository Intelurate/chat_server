
module.exports.set = function(socket, io, redis_client) {

	socket.on('getuserconnections', function(data) {
		var roomKey = data.roomKey;
		var index = data.index;
		redis_client.hgetall(roomKey+":users", function(err, users) {								
		 	var data = {
		 		room : roomKey,
		 		index : index
		 	};			 	
		 	if(users) {
		 		data.users = users; 
		 	}else{
		 		data.users = {}; 
		 	}			
		 	socket.emit('showconnections', data);
		 });
	});
}