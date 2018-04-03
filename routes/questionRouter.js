const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Questions = require ('../models/questions');

const questionRouter = express.Router();

var authenticate = require('../authenticate');

questionRouter.use(bodyParser.json());

questionRouter.route('/')
.get((req,res,next) => {
	Questions.find({})
	.then((questions) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(questions);
	}, (err) => next(err))
	.catch((err) => next(err));	
})
.post(authenticate.verifyUser, (req,res,next) => {
	Questions.create(req.body)
	.then((question) => {
		console.log('Question Created ', question);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(question);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /questions');
})
.delete(authenticate.verifyUser, (req,res,next) => {
	Questions.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});

questionRouter.route('/:questionId')
.get((req,res,next) => {
	Questions.findById(req.params.questionId)
	.then((question) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(question);
	}, (err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('POST operation not supported on /questions/'+ req.params.questionId);
})
.put(authenticate.verifyUser, (req,res,next) => {
	Questions.findByIdAndUpdate(req.params.questionId, {
		$set: req.body
	}, { new: true })
	.then((question) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(question);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
	Questions.findByIdAndRemove(req.params.questionId)
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
})

module.exports = questionRouter;