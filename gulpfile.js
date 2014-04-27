var gulp         = require('gulp');
var browserify   = require('gulp-browserify');
var handlebars   = require('gulp-handlebars');
var myth         = require('gulp-myth');
var hint         = require('gulp-jshint');
var concat       = require('gulp-concat');
var cache        = require('gulp-cache');
var gif          = require('gulp-if');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var declare      = require('gulp-declare');
var paths = {
	scripts: ['assets/js/**/*.js'],
	styles: ['assets/styles/**/*.css'],
	images: ['assets/images/**/*'],
	hbs: ['assets/templates/*.hbs']
};

var debug = process.env.NODE_ENV !== 'production';

gulp.task('concat', function() {
	return gulp.src(paths.scripts)
		.pipe(concat('all.js'))
		.pipe(gulp.dest('assets/prebuild'));
});

gulp.task('hint', function () {
	return gulp.src(paths.scripts)
		.pipe(hint());
});

gulp.task('images', function() {
	return gulp.src(paths.images)
		.pipe(imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest('builds/img'));
});

gulp.task('styles', function () {
	return gulp.src('assets/styles/styles.css')
		.pipe(myth())
		.pipe(gulp.dest('builds/css'));
});

gulp.task('scripts', ['hint', 'concat'], function () { //'templates'
	var ember, ember_data;
	if (debug) {
		ember = 'ember.js';
		ember_data = 'ember-data.js';
	} else {
		ember = 'ember.prod.js';
		ember_data = 'ember-data.prod.js';
	}
	return gulp.src('assets/prebuild/all.js')
		.pipe(browserify({
			debug: debug,
			shim: {
				jquery: {
					path: 'bower_components/jquery/dist/jquery.js',
					exports: '$'
				},
				handlebars: {
					path: 'bower_components/handlebars/handlebars.js',
					exports: 'Handlebars'
				},
				templates: {
					path: 'builds/templates.js',
					exports: 'Ember.TEMPLATES'
				},
				bootstrap: {
					path: 'bower_components/bootstrap/dist/js/bootstrap.js',
					exports: 'bootstrap',
					depends: {
						jquery: '$'
					}
				},
				moment: {
					path: 'bower_components/moment/moment.js',
					exports: 'moment'
				},
				ic_ajax: {
					path: 'bower_components/ic-ajax/dist/globals/main.js',
					exports: 'ic',
					depends: {
						ember: 'ember',
						jquery: '$'
					}
				},
				ember: {
					path: 'bower_components/ember/' + ember,
					exports: 'ember',
					depends: {
						handlebars: 'Handlebars',
						jquery: '$'
					}
				},
				ember_data: {
					path: 'bower_components/ember-data/' + ember_data,
					exports: 'DS',
					depends: {
						ember: 'ember',
						handlebars: 'Handlebars'
					}
				}
			}
		}))
		.on('prebundle', function (bundle) {
			bundle.add('../../bower_components/ember/' + ember);
			bundle.add('../../bower_components/ember-data/' + ember_data);
			bundle.add('../../builds/templates.js');
		})
		.pipe(gif(!debug, uglify()))
		.pipe(gulp.dest('builds/js'));
});

gulp.task('default', ['styles', 'scripts'], function () { });

gulp.task('watch', function () {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
});