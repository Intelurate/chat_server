//var util = require('util'),  
    http = require('http');

http.createServer(function (req, res) {  
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('hello, i know nodejitsu.')
  res.end();
}).listen(8008);

/* server started */  
//util.puts('> hello world running on port 8000');
console.log('hello world running on port 8008')
setTimeout(function () {  
  //util.puts('Throwing error now.');
  throw new Error('User generated fault.');
}, 5000);
