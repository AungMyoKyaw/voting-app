var twitterStrategy = require('passport-twitter').Strategy;

var User = require('../app/models/user.js');
var configAuth = require('./auth.js');

module.exports = function(passport){
	passport.serializeUser(function(user,done){
		done(null,user.id);
	});

	passport.deserializeUser(function(id,done){
		User.findById(id,function(err,user){
			done(err,user);
		});
	});

	passport.use(new twitterStrategy({
		consumerKey : configAuth.twitterAuth.consumerKey,
		consumerSecret : configAuth.twitterAuth.consumerSecret,
		callbackURL : configAuth.twitterAuth.callbackURL
	},
	function(token,tokenSecret,profile,done){
		process.nextTick(function(){
			User.findOne({
				'twitter.id': profile.id
			},function(err,user){
				if(err){
					return done(err);
				}
				console.log(user);
				if(user){
					return done(null,user);
				} else {
					var newUser = new User();
					newUser.twitter.id = profile.id;
					newUser.twitter.token = token;
					newUser.twitter.username = profile.userName;
					newUser.twitter.displayName = profile.displayName;

					newUser.save(function(err){
						if(err){
							return done(err);
						} else {
							return done(null,newUser);
						}
					})
				}
			})
		})
	}
	));
}