const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require ('../models/user');

const questionSchema = new Schema({
	question: {
		type: String,
		required: true
	},
	value: {
		type: Number,
		required: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
},{
	timestamps: true
});

var Questions = mongoose.model('Question', questionSchema);

module.exports = Questions;