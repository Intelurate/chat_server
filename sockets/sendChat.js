module.exports.set = function(socket, io, db, sanitizer) {
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {	
		
		db.collection(socket.room, function(err, collection) {
	        db.collection(socket.room, function(err, collection) {	 
	        	var d = new Date();
	        	var created = d.getTime();	    
	       		data = sanitizer.escape(data);	       	
	       		io.sockets.in(socket.room).emit('updatechat', socket.username, created, data );
	       		// we tell the client to execute 'updatechat' with 2 parameters
	            collection.insert({"name" : socket.username, "chat" : data, "created" : created }, {safe:true}, function(err, result){
	            	
	            });

	        });
	    });
	});
}