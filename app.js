var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var restful = require("./routes/restful.js");



var app = express();

app.set('port', process.env.PORT || 9898);
app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(require('express-useragent').express());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

process.on('uncaughtException', function (err) {
	 console.log('Process Exception: ' + err);
	 console.log(err.stack);
});

app.all("*", function(req, res, next){
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	next();
});

restful.initMaskList();
setInterval(restful.workingCrawling, 3000);

app.get('/', routes.index)
app.get('/restful/plz_get_mask', restful.plz_get_mask);
app.get('/restful/get_mask_list', restful.get_mask_list);
app.get('/restful/server_status', restful.serverStatus);

http.createServer(app).listen(app.get('port'), '0.0.0.0', function(){
	console.log("Http server listening on port " + app.get('port'));
});