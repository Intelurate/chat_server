var files = require('./files');

module.exports.set = function(app, fs, oppressor) {

	app.get('/', function (req, res) {
		var stream = fs.createReadStream('./index.html');
			stream.pipe(oppressor(req)).pipe(res);
	});
		
	files.set(app, fs, oppressor);
}