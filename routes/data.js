

exports.test = function (req, res) {

	var api = { Url : [
		{ url : "https://api.jquery.com/" },
		{ url : "https://www.yahoo.com/" }
	]};

    res.send(api);

}


