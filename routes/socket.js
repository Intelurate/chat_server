	
exports.start = function(req, res) {

	io.sockets.on('connection', function (socket) {

	    socket.emit('message', { message: 'welcome to the chat' });

	    socket.on('sendd', function (data) {
	        io.sockets.emit('message', data);
	    });

	});

};