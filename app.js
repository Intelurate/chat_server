var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var sanitizer = require('sanitizer');

var fs = require('fs');
var oppressor = require('oppressor');

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db;
    BSON = mongo.BSONPure;


var server2 = new Server('localhost', 27017, {auto_reconnect: true});

db = new Db('sc', server2, {safe:false});

db.open(function(err, db) {
    if(!err) {
    	
    	console.log('database connection successful');

        //db.collection('pictures', {strict:true}, function(err, collection) {
        //    if (err) {
       	//		console.log("The 'pictures' collection doesn't exist. Creating it with sample data...");
        //		populatePictures();
        //    }
        //});
    }else{
        console.log('err')
    }
});


server.listen(8000);

app.get('/js/:file', function (req, res) {
	var file = req.params.file;
	var stream = fs.createReadStream(__dirname + '/js/' + file + '.js');
    	stream.pipe(oppressor(req)).pipe(res);
});

app.get('/images/:file', function (req, res) {
	var file = req.params.file;
	var stream = fs.createReadStream(__dirname + '/images/' + file);
    	stream.pipe(oppressor(req)).pipe(res);
});

app.get('/css/:file', function (req, res) {
	var file = req.params.file;
	var stream = fs.createReadStream(__dirname + '/css/' + file + '.css');
    	stream.pipe(oppressor(req)).pipe(res);
});

app.get('/', function (req, res) {
	var stream = fs.createReadStream(__dirname + '/index.html');
		stream.pipe(oppressor(req)).pipe(res);
});

var data = require('./routes/data');
app.post('/test_data', data.test);

// usernames which are currently connected to the chat
var usernames = {};
// rooms which are currently available in chat
var rooms = [];

io.sockets.on('connection', function (socket) {

	//db.collection('room1', function(err, collection) {
	//    collection.remove();
	//});

	socket.on('geturlconnections', function(urls) {
		for(var a=0; a<urls.length; a++) {
			if(usernames[urls[a].room]) {	
				urls[a].count = usernames[urls[a].room].count;
			}else{
				urls[a].count = 0;
			}
		}
		socket.emit('showurlconnections', urls);
	});


	socket.on('gettrendingconnections', function() {

		var trending = [
			{ url : "https://www.yahoo.com/", visits : 30 },
			{ url : "https://www.google.com/", visits : 46 }			
		];

		socket.emit('showtrendingconnections', trending);

	});


	socket.on('getcurrentconnections', function(data) {

		socket.room = data.room;
		socket.join(socket.room);

		if(usernames[data.room]) {
			socket.emit('showcurrentconnections', usernames[data.room]);
		}
	});


	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(data) {

		// add the client's username to the global list
		if(!usernames[socket.room]) {
			usernames[socket.room] = {};
			usernames[socket.room]['count'] = 0;
		}

		//testing username
		if(usernames[socket.room][sanitizer.escape(data.username)]) {
			socket.emit('usernameliveexist', true);
		}else{
			
			socket.username = sanitizer.escape(data.username);
			usernames[socket.room][socket.username] = sanitizer.escape(data.username);
			usernames[socket.room]['count'] = (usernames[socket.room]['count']+1);

			socket.emit('showyourconnected', socket.username, usernames[socket.room]);

			// echo to room that a person has connected to their room
			socket.broadcast.to(socket.room).emit('shownewuser', socket.username, usernames[socket.room]);		
			//socket.emit('updaterooms', rooms, socket.room);

		    db.collection(socket.room, function(err, collection) {
		        collection.find().sort( { "created" : -1 } ).toArray(function(err, items) {
		            socket.emit('getsavedchat', socket.username, items);
		        });
		    });
		}
	
	});

	var currentRoom = '';

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


	// when the user disconnects.. perform this
	socket.on('disconnect', function() {
		if(usernames) {
			if(usernames[socket.room]) {
				if(usernames[socket.room][socket.username]) {
					delete usernames[socket.room][socket.username];
					// remove the username from global usernames list
					usernames[socket.room]['count'] = (usernames[socket.room]['count']-1);
					// update list of users in chat, client-side
					io.sockets.emit('updateusers', usernames);
					// echo globally that this client has left				
					socket.broadcast.to(socket.room).emit('userdisconnected', socket.username, usernames[socket.room] );
					socket.leave(socket.room);
				}

			}
		}
	});

});


