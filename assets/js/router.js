Player.Router.map(function() {
	this.resource('albums', { path: '/' }, function() {
		this.resource('album', { path: ':id' }, function() {
			this.route('tracks');
		});
	});
});

Player.AlbumsRoute = Ember.Route.extend({
	model: function() {
		return Player.Adapter.ajax('/albums').then(function(data) {
			var albums = data.map(Player.Album.createRecord, Player.Album);
			return Ember.RSVP.all(albums);
			// RSVP тут ни к чему, все модели в эмбер промис
		})
	}
});

Player.AlbumsIndexRoute = Ember.Route.extend({
	model: function() {
		return Player.Adapter.ajax('/tracks').then(function(data) {
			var tracks = data.map(Player.Track.createRecord, Player.Track);
			return Ember.RSVP.all(tracks);
		})
	}
});

Player.AlbumRoute = Ember.Route.extend({
	model: function(params) {
		return Player.Adapter.ajax('/album/' + params["id"]).then(function(data) {
			return Player.Album.createRecord(data);
		});
	}
});

Player.AlbumTracksRoute = Ember.Route.extend({
	controllerName: 'AlbumsIndex',
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('album', this.modelFor('album'));
	},
	model: function() {
		return this.modelFor('album').get('tracks');
	},
	renderTemplate: function(controller) {
		this.render('albums/index', { controller: controller});
	}
});

