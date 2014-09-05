var express = require('express');
var app = express();
var fs = require('fs');


/*
var options = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt'),
  ca: fs.readFileSync('./keys/ca.crt'),
  requestCert: true
};
*/


var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis_io = require('socket.io-redis');
    io.adapter(redis_io({ host: '127.0.0.1', port: 6379 }));



//var serverSSL = require('https').createServer(options, app);
//var io = require('socket.io').listen(serverSSL);


var sanitizer = require('sanitizer');
var oppressor = require('oppressor');
var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db;
    BSON = mongo.BSONPure;


/*
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'pass123',
  port     : '3307',
  database : 'chat_app_analytics'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});
*/


//var dbServerConnection = new Server('54.88.169.55', 27017, {auto_reconnect: true});

var dbServerConnection = new Server('localhost', 27017, {auto_reconnect: true});

var db = new Db('chatapp', dbServerConnection, {safe:false});

db.open(function(err, db) {
    if(!err) {
    	console.log('mongo database connection successful');
    }else{
        console.log('err')
    }
});

server.listen(8889);

//server.listen(80);
//serverSSL.listen(443);

var controllers = require('./controllers');
	controllers.set(app, fs, oppressor);


var sockets = require('./sockets');
    sockets.set(io, db, sanitizer);

