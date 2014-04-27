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