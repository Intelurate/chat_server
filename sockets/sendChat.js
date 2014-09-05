
var checkConnection = require('./checkConnection');

module.exports.set = function(socket, io, db, sanitizer) {
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {

		var roomKey = data.room;
		
		if(!io.sockets.adapter.rooms[roomKey]) {
			socket.join(roomKey);								
			console.log('joins room!!!');
		}else{
			console.log('already in room!!!');
		}


        db.collection(roomKey, function(err, collection) {	 
        	
        	var d = new Date();
        	var created = d.getTime();	    
       			data.message = sanitizer.escape(data.message);

            collection.insert({ "token" : data.user.token, "username" : data.user.username, "chat" : data.message, "created" : created }, 
            	{safe:true}, function(err, result) {
            	data.result = result[0];
            	
            	console.log('chat sent');

            	io.in(roomKey).emit('updatechat', { data : data });

            });

        });

	});
}