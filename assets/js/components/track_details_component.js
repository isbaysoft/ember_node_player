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