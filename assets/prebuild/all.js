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


Player.AlbumDetailsComponent = Ember.Component.extend({
	oldTitle: null,
	isTitleEditing: false,
	actions: {
		editTitle: function() {
			this.setProperties({ isTitleEditing: true, oldTitle: this.get('album.title') });
		},
		acceptChanges: function() {
			this.sendAction('edit', this.get('album'), { value: this.get('oldTitle'), name: 'title' });
			this.setProperties({isTitleEditing: false, oldTitle: null});
		},
		remove: function() {
			this.sendAction('remove', this.get('album'));
		}
	}
});
Player.TrackDetailsComponent = Ember.Component.extend({
	oldTitle: null,
	oldGenre: null,
	actions: {
		remove: function() {
			this.sendAction('remove', this.get('track'));
		},
		download: function() {
			this.sendAction('download', this.get('track'));
		},
		editTitle: function() {
			this.setProperties({ isTitleEditing: true, oldTitle: this.get('track.title') });
		},
		editGenre: function() {
			this.setProperties({ isGenreEditing: true, oldGenre: this.get('track.genre') });
		},
		acceptChanges: function() {
			var params = {
				type: this.get('isTitleEditing') ? "title" : "genre",
				old: !!this.get('oldTitle')
					? { value: this.get('oldTitle'), name: 'title' }
					: { value: this.get('oldGenre'), name: 'genre' }
			};
			this.sendAction('edit', this.get('track'), params);
			this.setProperties({isTitleEditing: false, isGenreEditing: false, oldTitle: null, oldGenre: null});
		}
	}
});
/**
 * Created by Blackening on 4/18/14.
 */
Player.AlbumsController = Ember.ArrayController.extend({
	albumsExist: function() {
		return this.get('model.length') > 0;
	}.property('length'),
	actions: {
		createAlbum: function() {
			var controller = this;
			Player.Adapter.ajax('/albums', {
				type: 'POST',
				data: {
					title: controller.get("newTitle"),
					releaseDate: new Date(),
					cover: "/img/holder.png"
				}
			}).then(function(data) {
				var album = Player.Album.createRecord(data, 'direct');
				controller.get('model').pushObject(album);
				controller.set("newTitle", "");
				controller.transitionToRoute('album.tracks', album);
			}, function(reason) {
					console.log('Failed to save album. Reason: ' + reason);
			});
		},
		editAlbum: function(album, params) {
			Player.Adapter.ajax('/album/' + album.get('_id'), { type: 'PUT', data: { title: album.get('title') } }).then(function() {}, function(reason) {
					console.log("Failed to update album. Reason: " + reason);
					album.set(params.name, params.value);
			});
		},
		removeAlbum: function(album) {
			var controller = this;
			var tracks = album.get('tracks.length') > 0 ? album.get('tracks').map(function(track) { return track._id }) : [];
			Player.Adapter.ajax('/album/' + album.get('_id'), { type: 'DELETE', data: { tracks: tracks } })
				.then(function(data) {
					controller.get('model').removeObject(album);
					controller.transitionToRoute('/');
			}, function(reason) {
				console.log("Failed to delete track. Reason: " + reason);
			})
		}
	}
});
Player.AlbumsIndexController = Ember.ArrayController.extend({
	trackCreationStarted: false,
	isTitleEditing: false,
	isGenreEditing: false,
	tracksExist: function() {
		return this.get('model.length') > 0;
	}.property('length'),
	trackCreationAvailable: function() {
		return this.get('trackCreationStarted');
	}.property('trackCreationStarted'),
	actions: {
		enableTrackCreation: function() {
			this.set('trackCreationStarted', true);
		},
		createTrack: function() {
			var controller = this;
			var album = controller.get('album') ? controller.get('album') : "";
//			var size = controller.get('fileSize');
//			var isBase64Encoded = controller.get('isBase64Enc');
			var data = {
				title: controller.get('newTitle'),
				album_id: album ? album.get('_id') : "",
				genre: controller.get('newGenre'),
				releaseDate: new Date(),
//				isBase64Enc: isBase64Encoded,
				file: controller.get('trackSource'),  //{ path: controller.get('trackSource'), filename: controller.get('trackSourceName'), type: controller.get('trackSourceType')},
				cover: controller.get('coverSource')  //isBase64Encoded ? controller.get('coverSource') : "/img/holder.png"
			};

			Player.Adapter.ajax('/tracks', { type: 'POST', data: data }).then(function(data) {
				var track = Player.Track.createRecord(data);
					if (album) {
						track.set('album', album);
						album.get('tracks').pushObject(track);
					} else {
						controller.get('model').pushObject(track);
					}
					controller.setProperties({newTitle: '', newGenre: '', trackSource: '', coverSource: null, fileSize: null, trackCreationStarted: false });
			}, function(reason) {
					console.log("Failed to save track. Reason: " + reason);
			});
		},
		downloadTrack: function(track) {
			console.log(track + ' to download');
//			Player.Adapter.ajax('/track/' + track.get('_id')).then(function() {}, function(reason) {
//				console.log("Failed to download track. Reason: " + reason);
//			});
		},
		editTrack: function(track, params) {
			var controller = this;
			var album = controller.get('album') ? controller.get('album') : "";
			var data = { id: track.get('_id'), album_id: album ? album.get('_id') : "" };

			params.type == "title" ? data.title = track.get('title') : data.genre = track.get('genre');
			Player.Adapter.ajax('/tracks', { type: 'PUT', data: data }).then(function(data) {}, function(reason) {
				console.log("Failed to update track. Reason: " + reason);
				track.set(params.name, params.value);
			});
		},
		removeTrack: function(track) {
			var controller = this;
			var album = controller.get('album');
			var data = album ? { id: track.get('_id'), album_id: album.get("_id") } : { id: track.get('_id') };
			Player.Adapter.ajax('/tracks', { type: 'DELETE', data: data }).then(function(data) {
				album ? album.get('tracks').removeObject(track) : controller.get('model').removeObject(track);
			}, function(reason) {
				console.log("Failed to delete track. Reason: " + reason);
			})
		}
	}
});
Ember.Handlebars.registerBoundHelper('formattedDate', function(date) {
	return moment(date).format('h:mma - D MMM YYYY');
});
//Player.Album = DS.Model.extend({
//	title: DS.attr('string'),
//	releaseDate: DS.attr('string'),
//	cover: DS.attr('string'),
//	tracks: DS.hasMany('track', { async: true })
//});

Player.Album = Ember.Object.extend({
	_id: '',
	title: '',
	releaseDate: '',
	cover: '',
	tracks: [],

	id: function() {
		return this.get('_id');
	}.property('_id')
});

Player.Album.reopenClass({
	createRecord: function(data, type) {
		var album = Player.Album.create({
			_id: data._id,
			title: data.title,
			releaseDate: data.releaseDate || new Date(),
			cover: data.cover || '/img/holder.png'
		});
		if (data.tracks && data.tracks.length > 0) {
			album.set('tracks', this.extractTracks(data.tracks, album));
		} else {
			album.set('tracks', []);
		}
		return type == 'direct' ? album : Ember.RSVP.resolve(album);
	},
	extractTracks: function(tracksData, album) {
		return tracksData.map(function(track) {
			return Player.Track.create({
				_id: track._id,
				title: track.title,
				genre: track.genre,
				releaseDate: track.releaseDate || new Date(),
				file: track.file,
				cover: track.cover || '/img/holder.png',
				album: album
			})
		})
	}
});


//Player.Track = DS.Model.extend({
//	title: DS.attr('string'),
//	genre: DS.attr('string'),
//	releaseDate: DS.attr('date'),
//	file: DS.attr('string'),
//	cover: DS.attr('string'),
//	album: DS.belongsTo('album', { async: true })
//});

Player.Track = Ember.Object.extend({
	_id: null,
	title: null,
	genre: null,
	releaseDate: null,
	file: null,
	cover: null,
	album: null
});

Player.Track.reopenClass({
	createRecord: function(data) {
		return Player.Track.create({
			_id: data._id,
			title: data.title,
			genre: data.genre,
			releaseDate: data.releaseDate || new Date(),
			file: data.file || 'something.mp3',
			cover: data.cover || '/img/holder.png',
			album: data.album || ""
		})
	}
});
Player.EditGenreView = Ember.TextField.extend({
	didInsertElement: function() {
		this.$().focus();
	}
});

Ember.Handlebars.helper('edit-genre', Player.EditGenreView);
Player.EditTitleView = Ember.TextField.extend({
	didInsertElement: function() {
		this.$().focus();
	}
});

Ember.Handlebars.helper('edit-title', Player.EditTitleView);
Player.FileUploadView = Ember.TextField.extend({
	type: 'file',
	attributeBindings: ['name'],
	change: function(evt) {
		var self = this;
		var input = evt.target;
		if (input.files && input.files[0]) {
			var reader = new FileReader(),
				file = input.files[0],
				fileName = file.name,
				fileSize = file.size;//,
//				filePath = input.value;
			if (fileSize < 5242880) {
				reader.onload = function(event) {
					var fileToUpload = reader.result;//,
//					    dataURL = event.target.result,
//						mimeType = dataURL.split(",")[0].split(":")[1].split(";")[0],
					var parentController = self.get('controller.parentView').get('controller');
					parentController.set(self.get('name'), fileToUpload);
					parentController.set(self.get('name') + "Name", fileName);
					parentController.set('fileSize', fileSize);
//					parentController.set(self.get('name') + "Type", mimeType);
//					parentController.set('isBase64Enc', fileSize < 800000);
				};
				reader.readAsDataURL(file);
			} else {
				input.value = "";
				alert("File is too big! 5MB max!")
			}
		}
	}
});
Player.AlbumsIndexView = Ember.View.extend();