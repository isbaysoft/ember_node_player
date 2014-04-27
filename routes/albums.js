var Album = require('models/album').Album;
var HttpError = require('error').HttpError;
var async = require('async');

exports.get = function(req, res) {
	Album.find({}, function(err, albums) {
		res.send(JSON.stringify(albums));
	});
};

exports.post = function(req, res) {
	var request = req.body;
	Album.create({
		title: request.title,
		cover: request.cover,
		release_date: request.releaseDate,
		tracks: request.tracks
	}, function(err, album) {
		if (err) new HttpError(err);
		res.send(album);
	})
};