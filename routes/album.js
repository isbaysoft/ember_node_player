var Album = require('models/album').Album;
var Track = require('models/track').Track;
var HttpError = require('error').HttpError;
var async = require('async');

exports.get = function(req, res) {
	Album.findById(req.params._id, function(err, album) {
		res.send(JSON.stringify(album));
	});
};

exports.put = function(req, res) {
	Album.update({_id: req.params._id}, { title: req.body.title }, function(err, album) {
		if (err) new HttpError(err);
		res.send(JSON.stringify(album));
	})
};

exports.del = function(req, res) {
	Album.findById(req.params._id, function(err, album) {
		if (err) new HttpError(res);
		if (req.body.tracks) {
			Track.remove({ _id : { '$in': req.body.tracks } }, function(err) {
				if (err) new HttpError(res);
				endRequest();
			});
		} else {
			endRequest();
		}

		function endRequest() {
			album.remove(function(err, removeRes) {
				if (err) new HttpError(res);
				res.send(JSON.stringify(removeRes));
			});
		}
	});
};