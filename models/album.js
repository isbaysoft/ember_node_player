var mongoose = require('libs/mongoose'),
	Schema = mongoose.Schema;

var schema = new Schema({
	title: {
		type: String,
		unique: true,
		required: true
	},
	cover: {
		type: String
	},
	tracks: {
		type: Array
	},
	release_date: {
		type: Date,
		default: Date.now
	}
});

exports.Album = mongoose.model('Album', schema);