function send(res, code, data) {
	if (!data) data = {};
	res.statusCode = code;
	res.send(data);
}

exports.index = (req, res) => {
	console.log('connect')
	res.render('index');
};