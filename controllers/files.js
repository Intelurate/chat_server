

module.exports.set = function(app, fs, oppressor) {

	app.get('/js/:file', function (req, res) {		
		var file = req.params.file;
		var stream = fs.createReadStream('./js/' + file + '.js');
	    	stream.pipe(oppressor(req)).pipe(res);
	});

	app.get('/images/:file', function (req, res) {
		var file = req.params.file;
		var stream = fs.createReadStream('./images/' + file);
	    	stream.pipe(oppressor(req)).pipe(res);
	});

	app.get('/css/:file', function (req, res) {
		var file = req.params.file;
		var stream = fs.createReadStream('./css/' + file + '.css');
	    	stream.pipe(oppressor(req)).pipe(res);
	});
	
}