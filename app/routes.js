module.exports = function(app,passport){
	app.get('/',function(req,res,next){
		if(req.isAuthenticated()){
			res.redirect('/profile');
		} else {
			var pullList = require('./models/pull.js');
			pullList.find({}).sort({_id:-1}).limit(6).exec(function(err,data){
				if(err){
					res.redirect('/');
				} else {
					console.log(data);
					res.render('index.ejs',{
						recent: data
					});
				}
			});
		}
	});

	app.get('/auth/twitter',passport.authenticate('twitter'));

	app.get('/auth/twitter/callback',passport.authenticate('twitter',{
		successRedirect: '/profile',
		failureRedirect: '/'
	}));

	app.get('/profile',function(req,res){
		if(req.isAuthenticated()){
			var pullList = require('./models/pull.js');
			pullList.find({createdBy:req.user.twitter.id}).sort({_id:-1}).exec(function(err,data){
				if(err){
					res.redirect('/');
				} else {
					res.render('profile.ejs',{
						userName: req.user.twitter.displayName,
						recentPull: data
					});	
				}
			});	
		} else {
			res.redirect('/');
		}
		
	});
	
	app.get('/logout',function(req,res){
		req.logout();
		res.redirect('/');
	});

	app.get('/new',function(req,res){
		if(req.isAuthenticated()){
			res.render('newPull.ejs',{
				userName : req.user.twitter.displayName,
			});
			// console.log(req.user.twitter);
		} else {
			res.redirect('/');
		}
	});

	app.post('/new',function(req,res){
		if(req.isAuthenticated() && req.body.Name){
			// console.log(req.body.Name);
			var optionList = req.body.optionList.split('\r\n');
			var optionListAndResult = [];
			optionList.forEach(function(element,index){
				if(element!==""){
					var toput = {
						name: element,
						value: 0
					}
					optionListAndResult.push(toput);
				}
			});
			var pullList = require('./models/pull.js');
			newPullList = new pullList();
			newPullList.Name = req.body.Name;
			newPullList.createdBy = req.user.twitter.id;
			// console.log(optionListAndResult);
			newPullList.optionListAndResult = optionListAndResult;
			newPullList.save(function(err){
				if(err){
					throw err;
				} else {
					// console.log(newPullList.id,'//////////////////');
					res.redirect('/pull/'+newPullList.id);
					// return done(null,newPullList);
				}
			});
		} else {
			res.redirect('/');
		}
	});

	app.get('/pull/:pullid',function(req,res){
		var pullList = require('./models/pull.js');
		pullList.findOne({_id:req.params.pullid},function(err,data){
			if(err){
				res.end(err);
			} else {
				// res.json(data);
				// res.json(data.optionListAndResult)
				// console.log(req.hostname,req.originalUrl)
				res.render('pullDisplay.ejs',{
					Name: data.Name,
					data: data.optionListAndResult,
					id: req.params.pullid,
					link: req.get('host')+req.originalUrl
				});
			}
		})
	});

	app.post('/pull/update',function(req,res){
		if(req.body.id && req.body.optionListAndResult!=="blah"){
			var pullList = require('./models/pull.js');
			pullList.findById(req.body.id,function(err,data){
				if(err){
					res.redirect('/');
				} else {
					var result = data.optionListAndResult;
					result[req.body.vote].value+=1;
					data.optionListAndResult = result;
					data.save(function(err){
						if(err){
							res.redirect('/');
						} else {
							res.redirect('/pull/'+req.body.id);
							// console.log('Successfully Updated');
						}
					})
					// console.log(result[req.body.vote]);
					// console.log(req.body,result[req.body.vote]);
					// res.json(result[req.body.vote]);
				}
			})
			// res.json(req.body);
		} else {
			res.end(':)');
		}
		// res.json(req.body);
	});

}