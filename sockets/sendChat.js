
var checkConnection = require('./checkConnection');

module.exports.set = function(socket, io, db, sanitizer, client_redis) {
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {

		//checkConnection.set(socket, data, client_redis, function(roomKey, data) {

		var roomKey = data.room;
		
		//check socket connection				
		if(!io.sockets.manager.rooms['/'+roomKey]) {
			console.log('reconnect to socket')
			socket.join(roomKey);								
		}

        db.collection(roomKey, function(err, collection) {	 
        	
        	var d = new Date();
        	var created = d.getTime();	    
       			data.message = sanitizer.escape(data.message);

            collection.insert({ "token" : data.user.token, "username" : data.user.username, "chat" : data.message, "created" : created }, 
            	{safe:true}, function(err, result) {
            	data.result = result[0];
            	io.sockets.in(roomKey).emit('updatechat', { data : data });
            });

        });

	});
}