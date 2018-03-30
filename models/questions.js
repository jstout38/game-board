const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
	question: {
		type: String,
		required: true
	},
	value: {
		type: Number,
		required: true
	},
	Author: {
		type: String
	}
},{
	timestamps: true
});

var Questions = mongoose.model('Question', questionSchema);

module.exports = Questions;