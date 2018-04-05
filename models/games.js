const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require ('../models/user');
const Category = require('../models/categories');

const gameSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	categories: {
		type: [Category.schema],
	}
},{
	timestamps: true
});

var Games = mongoose.model('Game', gameSchema);

module.exports = Games;