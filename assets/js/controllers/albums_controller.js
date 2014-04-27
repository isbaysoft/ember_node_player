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