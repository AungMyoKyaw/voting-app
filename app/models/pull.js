var mongoose = require('mongoose');

var pullSchema = mongoose.Schema({
	Name : String,
	createdBy: String,
	optionListAndResult : [{name:String,value:Number}]
});

module.exports = mongoose.model('pullList',pullSchema);