
module.exports.set = function(socket, io, db, publisher) {

	socket.on('getpaging', function(data) {
		
// { paging: { page: 2, skipped: 0 },
//   room: '037acf77482d425aa93d0c77f0a89412',
//   user: 
//    { avatar: 'animals/dog_avatar_0638.jpg',
//      token: 'c37cb6043429b68860f5bbdc4294ba62',
//      username: 'dOggies' } }

		var roomKey = data.room;

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