var pullList = require('./models/pull.js');

module.exports = function(app, passport) {
  // Home page
  app.get('/', async function(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/profile');
    }

    try {
      var data = await pullList.find({}).sort({ _id: -1 }).limit(6);
      res.render('index.ejs', { recent: data });
    } catch (err) {
      console.error('Error fetching polls:', err.message);
      res.render('index.ejs', { recent: [], error: 'Failed to load recent polls' });
    }
  });

  // Twitter authentication
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // Profile page (requires authentication)
  app.get('/profile', async function(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    try {
      var data = await pullList.find({ createdBy: req.user.twitter.id }).sort({ _id: -1 });
      res.render('profile.ejs', {
        userName: req.user.twitter.displayName,
        recentPull: data
      });
    } catch (err) {
      console.error('Error fetching user polls:', err.message);
      res.render('profile.ejs', {
        userName: req.user.twitter.displayName,
        recentPull: [],
        error: 'Failed to load your polls'
      });
    }
  });

  // Logout
  app.get('/logout', function(req, res) {
    req.logout(function(err) {
      if (err) {
        console.error('Logout error:', err.message);
      }
      res.redirect('/');
    });
  });

  // New poll page (requires authentication)
  app.get('/new', function(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }
    res.render('newPull.ejs', {
      userName: req.user.twitter.displayName
    });
  });

  // Create new poll (requires authentication)
  app.post('/new', async function(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    if (!req.body.Name || !req.body.optionList) {
      return res.render('newPull.ejs', {
        userName: req.user.twitter.displayName,
        error: 'Poll name and options are required'
      });
    }

    var optionList = req.body.optionList.split('\r\n');
    var optionListAndResult = [];

    optionList.forEach(function(element) {
      if (element.trim() !== '') {
        optionListAndResult.push({
          name: element.trim(),
          value: 0
        });
      }
    });

    if (optionListAndResult.length < 2) {
      return res.render('newPull.ejs', {
        userName: req.user.twitter.displayName,
        error: 'Please provide at least 2 options'
      });
    }

    var newPullList = new pullList();
    newPullList.Name = req.body.Name.trim();
    newPullList.createdBy = req.user.twitter.id;
    newPullList.optionListAndResult = optionListAndResult;

    try {
      await newPullList.save();
      res.redirect('/pull/' + newPullList.id);
    } catch (err) {
      console.error('Error saving poll:', err.message);
      res.render('newPull.ejs', {
        userName: req.user.twitter.displayName,
        error: 'Failed to create poll. Please try again.'
      });
    }
  });

  // View poll
  app.get('/pull/:pullid', async function(req, res) {
    try {
      var data = await pullList.findOne({ _id: req.params.pullid });
      if (!data) {
        return res.status(404).render('error.ejs', { message: 'Poll not found' });
      }
      res.render('pullDisplay.ejs', {
        Name: data.Name,
        data: data.optionListAndResult,
        id: req.params.pullid,
        link: req.get('host') + req.originalUrl
      });
    } catch (err) {
      res.status(404).render('error.ejs', { message: 'Poll not found' });
    }
  });

  // Vote on poll
  app.post('/pull/update', async function(req, res) {
    if (!req.body.id || req.body.optionListAndResult === 'blah') {
      return res.status(400).send('Invalid request');
    }

    var voteIndex = parseInt(req.body.vote, 10);
    if (isNaN(voteIndex)) {
      return res.status(400).send('Invalid vote');
    }

    try {
      var data = await pullList.findById(req.body.id);
      if (!data) {
        return res.redirect('/');
      }

      if (voteIndex < 0 || voteIndex >= data.optionListAndResult.length) {
        return res.status(400).send('Invalid vote option');
      }

      data.optionListAndResult[voteIndex].value += 1;
      await data.save();
      res.redirect('/pull/' + req.body.id);
    } catch (err) {
      console.error('Error saving vote:', err.message);
      res.redirect('/');
    }
  });
};
