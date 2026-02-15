require('dotenv').config();

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
var compression = require('compression');

// Validate required environment variables
var requiredEnvVars = ['TWITTER_CONSUMER_KEY', 'TWITTER_CONSUMER_SECRET', 'MONGODB_URI', 'SESSION_SECRET'];
var missingEnvVars = requiredEnvVars.filter(function(envVar) {
  return !process.env[envVar];
});

if (missingEnvVars.length > 0) {
  console.error('Error: Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file or environment configuration.');
  process.exit(1);
}

// MongoDB connection with error handling
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function() {
  console.log('Connected to MongoDB successfully');
}).catch(function(err) {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', function() {
  console.warn('MongoDB disconnected');
});

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

require('./config/passport.js')(passport);
routes(app, passport);

// Error handling middleware
app.use(function(err, req, res, next) {
  console.error('Server error:', err.message);
  res.status(500).render('error.ejs', {
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  });
});

// 404 handler
app.use(function(req, res) {
  res.status(404).render('error.ejs', { message: 'Page not found' });
});

app.listen(port, function() {
  console.log('Server running on port ' + port);
});
