
module.exports.set = function(socket, db, rooms) {

	socket.on('setpaging', function(data) {
		
		var page  = data.paging.page;
		var skipping  = ((page-1)*20) + data.paging.skipped;

	    db.collection(socket.room, function(err, collection) {
	        collection.find().sort( { "created" : -1 } ).limit(20).skip(skipping).toArray(function(err, items) {
	            socket.emit('getpaging', socket.user, items, rooms[socket.room]);
	        })
	    });		
	});

}