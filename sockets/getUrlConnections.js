
module.exports.set = function(socket, rooms) {
	
	socket.on('geturlconnections', function(urls) {
		for(var a=0; a<urls.length; a++) {
			if(rooms[urls[a].room]) {	
				urls[a].count = rooms[urls[a].room].count;
			}else{
				urls[a].count = 0;
			}
		}
		socket.emit('showurlconnections', urls);
	});

}