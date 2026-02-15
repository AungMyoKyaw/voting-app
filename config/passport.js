var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../app/models/user.js');
var configAuth = require('./auth.js');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    try {
      var user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL
  }, async function(token, tokenSecret, profile, done) {
    try {
      var user = await User.findOne({ 'twitter.id': profile.id });

      if (user) {
        return done(null, user);
      }

      // Create new user
      var newUser = new User();
      newUser.twitter.id = profile.id;
      newUser.twitter.token = token;
      newUser.twitter.username = profile.username;
      newUser.twitter.displayName = profile.displayName;

      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      console.error('Error in Twitter authentication:', err.message);
      return done(err);
    }
  }));
};
