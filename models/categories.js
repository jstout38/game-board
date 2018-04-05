const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require ('../models/user');
const Question = require('../models/questions');

const categorySchema = new Schema({
	name: {
		type: String,
		require: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	questions:[Question.schema]
},{
	timestamps: true
});

var Categories = mongoose.model('Category', categorySchema);

module.exports = Categories;