exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
    db.collection('pictures', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {

    db.collection('pictures', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });

};


exports.add = function(req, res) {

    db.collection('pictures', function(err, collection) {

        var pictures = { url : 'https://s3.amazonaws.com/StrangeChat/q0i5neo373c6apjdo07ut1klc1.jpg' };

        db.collection('pictures', function(err, collection) {
            collection.insert(pictures, {safe:true}, function(err, result){});
        });

    });
};


//var fs = require('fs');
//var im = require('imagemagick');

//The upload picture request handler
exports.upload = function(req, res) {

  //This debugging meassage displays all the info that comes with the file
  console.log("Received file:\n" + JSON.stringify(req.files));
 
 /*
  //Set the directory names
  var photoDir = __dirname+"/photos/";
  var thumbnailsDir = __dirname+"/photos/thumbnails/";
  var photoName = req.files.source.name;
 
  //We use Node's FileSystem to rename the file, which actually moves it from the /tmp/ folder it goes to on Linux
    fs.rename(
        req.files.source.path,
        photoDir+photoName,
        function(err){

            if(err != null){
                res.send({error:"Server Writting No Good"});
            } else {
            //If upload goes ok we go ahead an create the thumbnail
                im.resize({
                    srcData:fs.readFileSync(photoDir+photoName, 'binary'),
                    width:256
                }, 
                function(err, stdout, stderr){
                    if(err != null){
                      res.send({error:"Resizeing No Good"});
                    } else {
                        fs.writeFileSync(thumbnailsDir+"thumb_"+photoName, stdout, 'binary');
                        res.send("Ok");
                    }
                })   
            }       
        }    
    );

    */

}


exports.getRandom = function(req, res) {
    
    var totalRecords;

    db.collection('pictures', function(err, collection) {
        collection.find().count(function(err, count) {
            totalRecords = count;            
            collection.find().limit(1).
            skip(Math.floor(Math.random()*totalRecords)).

            toArray(function(err, items) {
                res.send({"picture" : items[0]}); 
            });
        });
    });
};

