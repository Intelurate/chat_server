module.exports.set = function(socket, io, db, sanitizer) {
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {

// { room: '037acf77482d425aa93d0c77f0a89412',
//   user: 
//    { avatar: 'random/091220825359.jpg',
//      token: '80d064451151f3e18ebcfe67897e77d4',
//      username: 'Weddsy' },
//   avatar: 'random/091220825359.jpg',
//   message: 'ZGRkZA==' }


		var roomKey = data.room;
		
		//needs to be fixed
		socket.join(roomKey);

        db.collection(roomKey, function(err, collection) {	 
        	
        	var d = new Date();
        	var created = d.getTime();	    
       			//data.message = sanitizer.escape(data.message);

            collection.insert({ "token" : data.user.token, "username" : data.user.username, "avatar" : data.user.avatar, "chat" : data.message, "created" : created }, 
            	{safe:true}, function(err, result) {
            	data.result = result[0];     	
            	io.in(roomKey).emit('updatechat', { data : data });

            });

        });

	});
}