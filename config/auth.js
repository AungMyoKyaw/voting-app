module.exports = {
  twitterAuth: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:3000/auth/twitter/callback'
  }
};
