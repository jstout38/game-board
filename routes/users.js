var express = require('express');
var router = express.Router();
const cors = require('./cors')

const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');

var authenticate = require('../authenticate');

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )

/* POST to signup route to create a new user */
router.post('/signup', cors.cors, (req, res, next) => {
	User.register(new User({username: req.body.username}),
		req.body.password, (err, user) => {
		if(err) {
			res.statusCode = 500;
			res.setHeader('Content-Type', 'application/json');
			res.json({err: err});
		}
		else {
			if (req.body.firstname)
				user.firstname = req.body.firstname;
			if (req.body.lastname)
				user.lastname = req.body.lastname;
			user.save((err, user) => {
				if (err) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.json({err: err});
					return ;
				}
				passport.authenticate('local')(req, res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({success: true, status: 'Registration Successful!'});
				});
			});
		}
	});
});

/* POST to login route to sign in as a user */
router.post('/login', cors.cors, (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err)
			return next(err);

		if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: false, status: 'Login Unsuccessful!', err: info});
		}
		req.logIn(user, (err) => {
			if (err) {
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});
			}
			
			var token = authenticate.getToken({_id: req.user._id});
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: true, token: token, status: 'You are successfully logged in!', userID: req.user._id, username: req.user.username});
			});
		}) (req, res, next);
	});
	


/* GET logout route to log user out */
router.get('/logout', cors.cors, (req, res, next) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/');
	}
	else {
		var err = new Error('You are not logged in!');
		err.status = 403;
		next(err);
	}
});

/* GET users listing. */
router.get('/', cors.cors, function(req, res, next) {
  User.find({})
	.then((users) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(users);
	}, (err) => next(err))
	.catch((err) => next(err));	
});



module.exports = router;
