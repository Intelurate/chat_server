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

var dbServerConnection = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('chatapp', dbServerConnection, {safe:false});

db.open(function(err, db) {
    if(!err) {
    	console.log('mongo database connection successful');
    }else{
        console.log('err')
    }
});

server.listen(8888);

var controllers = require('./controllers');
	controllers.set(app, fs, oppressor);


var sockets = require('./sockets');
sockets.set(io, db, sanitizer);




