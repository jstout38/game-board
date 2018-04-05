const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

const Questions = require ('../models/questions');

const questionRouter = express.Router();

var authenticate = require('../authenticate');

questionRouter.use(bodyParser.json());

questionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Questions.find({})
	.populate('author')
	.then((questions) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(questions);
	}, (err) => next(err))
	.catch((err) => next(err));	
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	req.body.author = req.user._id
	Questions.create(req.body)
	.then((question) => {
		console.log('Question Created ', question);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(question);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /questions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Questions.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});

questionRouter.route('/:questionId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Questions.findById(req.params.questionId)
	.populate('author')
	.then((question) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(question);
	}, (err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('POST operation not supported on /questions/'+ req.params.questionId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Questions.findByIdAndRemove(req.params.questionId)
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
})

module.exports = questionRouter;