var mongoose = require('libs/mongoose');
mongoose.set('debug', true);
var async = require('async');

async.series([
	open,
	dropDataBase,
	requireModels,
	createAlbums,
	createTracks
], function(err) {
	mongoose.disconnect();
	process.exit(err ? 255 : 0);
});

function open(callback) {
	mongoose.connection.on('open', callback);
}

function dropDataBase(callback) {
	var db = mongoose.connection.db;
	db.dropDatabase(callback);
}

function requireModels(callback) {
	require('models/album');
	require('models/track');
	async.each(Object.keys(mongoose.models), function(modelName, callback) {
		mongoose.models[modelName].ensureIndexes(callback);
	}, callback);
}

function createAlbums(callback) {
	var albums = [
		{
			tracks: [],
			title: "Black",
			release_date: new Date(),
			cover: "/img/holder.png"
		},
		{
			tracks: [],
			title: "Red",
			release_date: new Date(),
			cover: "/img/holder.png"
		},
		{
			tracks: [],
			title: "Yellow",
			release_date: new Date(),
			cover: "/img/holder.png"
		}
		];

	async.each(albums, function(albumData, callback) {   //this kind of each drops argument "affected" in callback,
		var album = new mongoose.models.Album(albumData); //so we don't need to reduce arguments to (err, results) from (err, results, affected)
		album.save(callback);
	}, callback);
}

function createTracks(callback) {
	var tracks = [
		{
			album: "",
			title: "Another one",
			genre: "Metal",
			release_date: new Date(),
			file: "AnotherOne.mp3",
			cover: "/img/holder.png"
		},
		{
			album: "",
			title: "Another two",
			genre: "Metal",
			release_date: new Date(),
			file: "AnotherOne.mp3",
			cover: "/img/holder.png"
		},
		{
			album: "",
			title: "Another three",
			genre: "Metal",
			release_date: new Date(),
			file: "AnotherOne.mp3",
			cover: "/img/holder.png"
		}
	];
	async.each(tracks, function(trackData, callback) {   //this kind of each drops argument "affected" in callback,
		var track = new mongoose.models.Track(trackData); //so we don't need to reduce arguments to (err, results) from (err, results, affected)
		track.save(callback);
	}, callback);
}
