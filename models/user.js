var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	admin: {
		type: Boolean,
		default: false
	},
	firstname: {
		type: String,
		require: true
	},
	lastname: {
		type: String,
		require: true
	}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);