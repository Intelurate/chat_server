
module.exports.set = function(socket, io, db, sanitizer) {
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {	
		db.collection(socket.room, function(err, collection) {
	        db.collection(socket.room, function(err, collection) {	 
	        	var d = new Date();
	        	var created = d.getTime();	    
	       			data = sanitizer.escape(data);	       	

	            collection.insert({ "token" : socket.user.token, "username" : socket.user.username, "chat" : data, "created" : created }, 
	            	{safe:true}, function(err, result) {

	            	io.sockets.in(socket.room).emit('updatechat', socket.user, result[0]);
	            });

	        });
	    });
	});
}