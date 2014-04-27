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