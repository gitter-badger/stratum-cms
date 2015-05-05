var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish'),
	eslint = require('gulp-eslint'),
	watch = require('gulp-watch');

/*
 * Create variables for our project paths so we can change in one place
 */
var paths = {
	'src':['./models/**/*.js', './routes/**/*.js', 'keystone.js']
};


// gulp lint
gulp.task('lint', function(){
	gulp.src(paths.src)
		.pipe(eslint())
		.pipe(eslint.format());
		// .pipe(eslint.failOnError());
		// .pipe(jshint.reporter(jshintReporter));

});

// gulp watcher for lint
gulp.task('watch:lint', function () {
	gulp.src(paths.src)
		.pipe(watch())
		.pipe(eslint())
		.pipe(eslint.format());
});
