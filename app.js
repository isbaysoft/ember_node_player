var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('./libs/log')(module);
var mongoose = require('./libs/mongoose');
var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//app.use(express.favicon());

if (app.get('env') == 'development') {
	app.use(express.logger('dev'));
} else {
	app.use(express.logger('default'));
}

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb'}));

app.use(express.cookieParser());


//middleware
//

app.use(app.router);
require('./routes')(app);

//client-code
app.use(express.static(path.join(__dirname, 'builds')));

//404
app.use(function(req, res) {
	res.send(404, "Page not found");
});

//process.env.PORT only for "heroku" :)
var port = Number(process.env.PORT || 5000);
var server = http.createServer(app).listen(port, function() {
	console.log('Express server listening on port ' + config.get('port'));
});
