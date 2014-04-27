var Track = require('models/track').Track;
var Album = require('models/album').Album;
var HttpError = require('error').HttpError;

exports.get = function(req, res) {
	Track.find({ album: "" }, function(err, tracks) {
		res.send(JSON.stringify(tracks));
	});
};

exports.post = function(req, res) {
	var request = req.body;
	Track.create({
			title: request.title,
			genre: request.genre,
			cover: request.cover,
			file: request.file,
			release_date: request.releaseDate,
			album: request.album_id
		}, function(err, track) {
			if (err) new HttpError(err);
			if (request.album_id != "") {
				Album.update({ _id: request.album_id }, { $push: { tracks: track } }, function(err) {
					if (err) new HttpError(err);
					res.send(JSON.stringify(track));
				});
			} else {
				res.send(JSON.stringify(track));
			}
//			if (!request.isBase64Enc) { ENOENT error from GridFS, there's no time to explain
//				track.addFile(request.file, { content_type: request.file.type }, function(err, result) {
//					if (err) new HttpError(err);
//					endRequest();
//				});
//			} else {
//				endRequest();
//			}
	});
};

exports.put = function(req, res) {
	var request = req.body;

	Track.findById(request.id, function(err, track) {
		var updating = request.title
			? { outer: { title: request.title }, find: { _id: request.album_id, 'tracks._id': track.id }, inner: { 'tracks.$.title': request.title } }
			: { outer: { genre: request.genre }, find: { _id: request.album_id, 'tracks._id': track.id }, inner: { 'tracks.$.genre': request.genre } };
		if (err) new HttpError(res);
		track.update(updating.outer, function(err, updRes) {
			if (err) new HttpError(res);
			if (request.album_id) {
				Album.update(updating.find, { $set: updating.inner }, function(err, aupdRes) {
					if (err) new HttpError(err);
					res.send(JSON.stringify(aupdRes));
				});
			} else {
				res.send(JSON.stringify(updRes));
			}
		})
	});
};

exports.del = function(req, res) {
	var request = req.body;
	Track.findById(request.id, function(err, track) {
		if (err) new HttpError(res);
		track.remove(function(err, removeRes) {
			if (err) new HttpError(res);
			if (request.album_id) {
				Album.update({ _id: request.album_id }, { $pull: { tracks: track } }, function(err, updateRes) {
					if (err) new HttpError(err);
					res.send(JSON.stringify(updateRes));
				});
			} else {
				res.send(JSON.stringify(removeRes));
			}
		})
	});
};