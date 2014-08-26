
module.exports.set = function(socket, io, db, client_redis) {

	socket.on('getpaging', function(data) {
		
		var roomKey = data.room;
		
		//check socket connection				
		if(!io.sockets.manager.rooms['/'+roomKey]) {
			console.log('reconnect to socket')
			socket.join(roomKey);								
		}

		var page  = data.paging.page;

		var skipping  = ((page-1)*20) + data.paging.skipped;

	    db.collection(roomKey, function(err, collection) {
	        collection.find().sort( { "created" : -1 } ).limit(20).skip(skipping).toArray(function(err, items) {

	        	data.items = items;
	            socket.to(roomKey).emit('sendpaging', data);

	            //socket.emit('sendpaging', socket.user, items, rooms[socket.room]);

	        })
	    });		
	});

}