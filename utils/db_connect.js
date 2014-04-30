var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db;
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('sc', server, {safe:false});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'sc' database");
        db.collection('pictures', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'pictures' collection doesn't exist. Creating it with sample data...");
                populatePictures();
            }
        });
    }else{
        console.log('err')
    }
});

/*

var populatePictures = function() {
    
	var pictures = [
		{ url : 'https://s3.amazonaws.com/StrangeChat/d45enf3p6puukoveign4lop2fv.jpg' },
		{ url : 'https://s3.amazonaws.com/StrangeChat/q0i5neo373c6apjdo07ut1klc1.jpg' },
	]

	db.collection('pictures', function(err, collection) {
		collection.insert(pictures, {safe:true}, function(err, result){});
	});

};

*/