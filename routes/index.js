
/*
 * GET home page.
 */

module.exports = function(app) {
	app.get('/', require('./main').get);

	app.get('/albums', require('./albums').get);

	app.post('/albums', require('./albums').post);

	app.get('/album/:_id', require('./album').get);

	app.put('/album/:_id', require('./album').put);

	app.del('/album/:_id', require('./album').del);

	app.get('/tracks', require('./tracks').get);

	app.post('/tracks', require('./tracks').post);

	app.put('/tracks', require('./tracks').put);

	app.del('/tracks', require('./tracks').del);

	app.get('/track/:id', require('./track').get);

};