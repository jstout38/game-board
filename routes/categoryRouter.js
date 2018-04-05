const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

const Questions = require ('../models/questions');
const Categories = require ('../models/categories');

const categoryRouter = express.Router();

var authenticate = require('../authenticate');

categoryRouter.use(bodyParser.json());

categoryRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Categories.find({})
	.then((categories) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(categories);
	}, (err) => next(err))
	.catch((err) => next(err));	
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Categories.create(req.body)
	.then((category) => {
		console.log('Category Created ', category);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(category);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /categories');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Categories.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});

categoryRouter.route('/:categoryId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Categories.findById(req.params.categoryId)
	.then((category) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(category);
	}, (err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('POST operation not supported on /questions/' + req.params.categoryId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Categories.findByIdAndUpdate(req.params.categoryId, {
		$set: req.body
	}, { new: true })
	.then((category) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(category);
	}, (err) = next(err))
	.catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Categories.findByIdAndRemove(req.params.categoryId)
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
})

categoryRouter.route('/:categoryId/questions')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Categories.findById(req.params.categoryId)
	.then((category) => {
		if (category != null) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(category.questions);
		}
		else {
			err = new Error('Category ' + req.params.categoryId + ' not found');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Categories.findById(req.params.categoryId)
	.then((category) => {
		if (category != null) {
			category.questions.push(req.body);
			category.save()
			.then((category) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(category);
			}, (err) => next(err));
		}
		else {
			err = new Error('Category ' + req.params.categoryId + ' not found');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('PUT operation not suported on /categories/'
		+ req.params.categoryId + '/questions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Categories.findById(req.params.categoryId)
	.then((category) => {
		if (category != null) {
			for (var i = (category.questions.length - 1); i >= 0; i--) {
				category.questions.id(category.questions[i]._id).remove();
			}
			category.save()
			.then((category) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(category);
			}, (err) => next(err));
		}
		else {
			err = new Error('Category ' + req.params.categoryId + ' not found');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
});

categoryRouter.route('/:categoryId/questions/:questionId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Categories.findById(req.params.categoryId)
	.then((category) => {
		if (category != null && category.questions.id(req.params.questionId) != null) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(category.questions.id(req.params.questionId));
		}
		else if (category == null) {
			err = new Error('Category ' + req.params.categoryId + ' not found');
			err.status = 404;
			return next(err);
		}
		else {
			err = new Error('Question ' + req.params.questionId + ' not found');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('POST operation not supported on /categories/' + req.params.categoryId
		+ '/questions/' + req.params.questionId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Categories.findById(req.params.categoryId)
	.then((category) => {
		if (category != null && category.questions.id(req.params.questionId) != null) {
			if (req.body.question) {
				category.questions.id(req.params.questionId).question = req.body.question;
			}
			if (req.body.value) {
				category.questions.id(req.params.questionId).value = req.body.value;
			}
			category.save()
			.then((category) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(category);
			}, (err) => next(err));
		}
		else if (category == null) {
			err = new Error('Category ' + req.params.categoryId + ' not found');
			err.status = 404;
			return next(err);
		}
		else {
			err = new Error('Question ' + req.params.questionId + ' not found');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Categories.findById(req.params.categoryId)
	.then((category) => {
		if (category != null && category.questions.id(req.params.questionId) != null) {
			category.questions.id(req.params.questionId).remove();
			category.save()
			.then((category) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(category);
			}, (err) => next(err));
		}
		else if (category == null) {
			err = new Error('Category ' + req.params.categoryId + ' not found');
			err.status = 404;
			return next(err);
		}
		else {
			err = new Error('Question ' + req.params.questionId + ' not found');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = categoryRouter;