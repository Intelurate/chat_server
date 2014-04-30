

exports.add = function(req, res) {
    db.collection('pictures', function(err, collection) {
        collection.find().count(function(err, count) {
            totalRecords = count;            
            collection.find().limit(1).
            skip(Math.floor(Math.random()*totalRecords)).
            toArray(function(err, items) {                
                res.send({"picture" : items[0]});
                db.collection('stack', function(err, collection) {
                    var stack = { 'picture_id' : items[0]._id };
                    collection.insert(stack, {safe:true}, function(err, result){} );        
                    res.send("Added");
                });

            });
        });
    });
};


exports.like = function(req, res) {

    if(req.body.picture_id){

        var picture_id = req.body.picture_id;
        
        db.collection('stack', function(err, collection) {
            
            var stack = [{ 'picture_id' : picture_id }, { 'picture_id' : picture_id }];

            collection.insert(stack, {safe:true}, function(err, result){} );  

            res.send("Liked");

        });
    }       
}


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


exports.getTop = function(req, res) {
    db.collection('stack', function(err, collection) {
        collection.findOne(function(err, item) {            
            db.collection('pictures', function(err, collection) {
                collection.findOne({'_id': new BSON.ObjectID( item.picture_id.toString() ) }, function(err, pic) {                                      
                    res.send({"picture" : pic}); 
                });
            }); 
            collection.remove({'_id': new BSON.ObjectID(item._id.toString()) }, function(err, result) {
                if (err) {
                    res.send(err);
                }
            });
        });
    });
};

