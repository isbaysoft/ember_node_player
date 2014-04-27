var mongoose = require('libs/mongoose');
var gridfs = require('libs/gridfs');
var Schema = mongoose.Schema;

var schema = new Schema({
	title: {
		type: String,
		unique: true,
		required: true
	},
	album: {
		type: String
	},
	genre: {
		type: String
	},
	file: {
		type: String
	},
	cover: {
		type: String
	},
	release_date: {
		type: Date,
		default: Date.now
	}
});

schema.methods.addFile = function(file, options, fn) {
	var trackSchema = this;
	return gridfs.putFile(file.path, file.filename, options, function(err, res) {
		if (err) new Error(err);
		trackSchema.files.push(res);
		trackSchema.save(fn);
	})

};

exports.Track = mongoose.model('Track', schema);