    var redis = require("redis"),
        client = redis.createClient(6379, '127.0.0.1', {});


    var key2 = "room1";

	client.HMSET(key2, {
	    "0123456789": "abcdefghij", 
	    "some manner of key": "a type of value", 
	    'users' : [{'user':'eddie'}] 
	});


	client.hgetall(key2, function (err, obj) {
	    console.dir(obj);
	});


/*
	client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
	client.hgetall("hosts", function (err, obj) {
	    console.dir(obj);
	});

    // if you'd like to select database 3, instead of 0 (default), call
    // client.select(3, function() { });

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.set("name", "Eddie", redis.print);


    client.get("name", function(err, reply) {
    	console.log(reply)
    });

    client.set("string key", "string val", redis.print);


    client.hset("hash key", "hashtest 1", "some value", redis.print);
    
    
    client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
    

    client.hkeys("hash key", function (err, replies) {
    
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        client.quit();
    });

    */