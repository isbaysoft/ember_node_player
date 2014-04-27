Ember.Handlebars.registerBoundHelper('formattedDate', function(date) {
	return moment(date).format('h:mma - D MMM YYYY');
});