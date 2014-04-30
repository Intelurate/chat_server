



exports.add = function(req, res) {
    db.collection('profiles', function(err, collection) {
        var profile = { 'profile' : "Cool Profile" };
        collection.insert(profile, {safe:true}, function(err, result){
            res.send("Added");
        });                
    });
};



exports.get = function(req, res) {
    db.collection('profiles', function(err, collection) {       
        collection.findOne(function(err, item) {  
            res.send({"profiles" : item});
        });
    });
};

/*
exports.remove = function(req, res) {
    db.collection('stack', function(err, collection) {
        collection.remove({'_id': new BSON.ObjectID('529e987cc483b287be000002') }, function(err, result) {

            if (err) {
                console.log(err);
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }

        });
    });
};

*/