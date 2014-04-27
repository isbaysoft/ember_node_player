require('ember');
require('ember_data');
require('moment');
require('ic_ajax');

window.Player = Ember.Application.create({
	LOG_TRANSITIONS: true
});

Player.Adapter = {
	ajax: function(path, options) {
		var options = options || {};
		options.dataType = 'json';
		return ic.ajax.request('http://localhost:5000' + path, options);
	}
};

//Player.RESTAdapter = DS.RESTAdapter.extend({
//	url: 'localhost:5000',
//	serializeId: function(id) {
//		return id.toString();
//	}
//});
//
//Player.AlbumSerializer = DS.RESTSerializer.extend({
//	primaryKey: function() {
//		return '_id';
//	}.property()
//});
//
//Player.TrackSerializer = DS.RESTSerializer.extend({
//	primaryKey: function() {
//		return '_id';
//	}.property()
//});
//
//Player.Store = DS.Store.extend({
//	revision: 12,
//	adapter: DS.RESTAdapter
//});