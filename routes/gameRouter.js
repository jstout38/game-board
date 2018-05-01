const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

const Games = require('../models/games');
const Questions = require ('../models/questions');
const Categories = require ('../models/categories');

const gameRouter = express.Router();

var authenticate = require('../authenticate');

gameRouter.use(bodyParser.json());

gameRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Games.find({})
	.populate('author')
	.then((games) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(games);
	}, (err) => next(err))
	.catch((err) => next(err));	
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	req.body.author = req.user._id;
	Games.create(req.body)
	.then((game) => {
		console.log('Game Created ', game);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(game);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /games');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Games.deleteMany({_id: {$in: req.body._ids}})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});

gameRouter.route('/:gameId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Games.findById(req.params.gameId)
	.populate('author')
	.then((game) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(game);
	}, (err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('POST operation not supported on /games/' + req.params.gameId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Games.findByIdAndUpdate(req.params.gameId, {
		$set: req.body
	}, { new: true })
	.then((game) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(game);
	}, (err) = next(err))
	.catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Games.findByIdAndRemove(req.params.gameId)
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
})

gameRouter.route('/:gameId/categories')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Games.findById(req.params.gameId)
	.populate('author')
	.then((game) => {
		if (game != null) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(game.categories);
		}
		else {
			err = new Error('Game ' + req.params.gameId + ' not found');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
//TO DO Change this to a many function
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	var game = Games.findById(req.params.gameId);
	var cats = game.then(function(game) {
		return Categories.find( { _id: { $in: req.body._ids }}).exec();
	});
	Promise.all([game, cats]).then(function([game, cats]) {
		console.log(game);
		console.log(cats);
		for (var i = 0; i < cats.length; i++) {
			game.categories.push(cats[i]);
		}
		game.save()
		.then((game) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(game);
		}, (err) => next(err));
	}, (err) => next(err))
	.catch((err) => next(err));
	
	
	/*
	Games.findById(req.params.gameId)
	.then((game) => {
		if (game != null) {
			
				for (var i = 0; i < req.body._id.length; i++) {
					Categories.findById(req.body._id[i])
					.then((category) => {
						game.categories.push(category);						
						game.save()
						.then((game) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(game);
						}, (err) => next(err));
					})					
				}
				
			
		}
		else {
			err = new Error('Game ' + req.params.gameId + ' not found');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));*/
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('PUT operation not suported on /games/'
		+ req.params.gameId + '/categories');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Games.findById(req.params.gameId)
	.then((game) => {
		if (game != null) {
			for (var i = (game.categories.length - 1); i >= 0; i--) {
				game.categories.id(game.categories[i]._id).remove();
			}
			game.save()
			.then((game) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(game);
			}, (err) => next(err));
		}
		else {
			err = new Error('Game ' + req.params.gameId + ' not found');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = gameRouter;