var mongoose = require('libs/mongoose');
var request = require('request');

var GridStore = mongoose.mongo.GridStore;
var Grid = mongoose.mongo.Grid;
var ObjectID = mongoose.mongo.BSONPure.ObjectID;

exports.get = function(id, fn) {
	var db = mongoose.connection.db;
	var id = new ObjectID(id);
	var store = new GridStore(db, id, "r", { root: "fs" });
	return store.open(function(err, store) {
		if(err) return fn(err);
		if (("" + store.filename) === ("" + store.fileId) && store.metadata && store.metadata.filename) {
			store.filename = store.metadata.filename;
		}
		return fn(null, store);
	})
};

exports.put = function(buf, name) {
	var _i;
	var options = 4 <= arguments.length ? Array.prototype.slice.call(arguments, 2, _i = arguments.length - 1) : (_i = 2), fn = arguments[_i++];
	var db = mongoose.connection.db;
	options = parse(options);
	options.metadata.filename = name;
	return new GridStore(db, name, "w", options).open(function(err, file) {
		if (err) {
			return fn(err);
		}
		return file.write(buf, true, fn);
	});
};

exports.putFile = function(path, name, options, fn) {
	var db = mongoose.connection.db;
	options = parse(options);
	options.metadata.filename = name;
	return new GridStore(db, name, "w", options).open(function(err, file) {
		if (err) {
			return fn(err);
		}
		return file.writeFile(path, fn);
	});
};

var parse = function(options) {
	var opts = {};
	if (options.length > 0) opts = options[0];
	if (!opts.metadata) opts.metadata = {};
	return opts;
};
