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

