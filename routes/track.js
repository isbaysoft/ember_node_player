var Track = require('models/track').Track;
var HttpError = require('error').HttpError;
var fs = require('fs');

exports.get = function(req, res) {
	Track.findById(req.params.id, function(err, track) {
		if (err) new HttpError(err);
		var decodedFile = new Buffer(track.file.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
		fs.writeFile(track.title + ".mp3", decodedFile, function(err) {});
	});
};