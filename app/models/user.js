var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	twitter:{
		id: String,
		token: String,
		displayName: String,
		userName: String
	}
});

module.exports = mongoose.model('User',userSchema);