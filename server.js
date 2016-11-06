var express = require('express');
var app = express();
var routes = require('./app/routes.js');
var mongoose = require('mongoose');
var dbUrl = require('./config/database.js').url;
var port = process.env.PORT || 3000;
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

mongoose.connect(dbUrl);
app.set('view engine','ejs');
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport.js')(passport);
routes(app,passport);

app.listen(port,function(){
	console.log('Everything is OK :)');
});