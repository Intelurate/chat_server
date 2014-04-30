
exports.getTags = function(req, res) {

/*
    db.collection('pictures', function(err, collection) {
        collection.find().count(function(err, count) {
            totalRecords = count;            
            collection.find().limit(1).
            skip(Math.floor(Math.random()*totalRecords)).

            toArray(function(err, items) {
                
                res.send({"picture" : items[0]}); 

                //res.send(items);

            });
        });
    });
*/

var tags =[{ 'tag' : 'Football' },
            { 'tag' : 'Cars' },
            { 'tag' : 'Girls' },
            { 'tag' : 'Guitars' },
            { 'tag' : 'Jive turkeys' },
            { 'tag' : 'Flowers' },
            { 'tag' : 'Dogs' },
            { 'tag' : 'Cats' },];

    res.send({ "tags" : tags});


};

