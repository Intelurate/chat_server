
module.exports.set = function(socket, io, db, publisher) {

	socket.on('getpaging', function(data) {
		
		var roomKey = data.room;
		
		if(!io.sockets.adapter.rooms[roomKey]) {
			socket.join(roomKey);								
			console.log('joins room!!!');
		}else{
			console.log('already in room!!!');
		}

		var page  = data.paging.page;
		var skipping  = ((page-1)*20) + data.paging.skipped;

	    db.collection(roomKey, function(err, collection) {
	        collection.find().sort( { "created" : -1 } ).limit(20).skip(skipping).toArray(function(err, items) {
	        	data.items = items;
				io.to(roomKey).emit('sendpaging', data);	           
	        })
	    });		
	});

}