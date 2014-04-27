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