var gulp = require('gulp');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var webpackConfig = require('./webpack.config.js');
var extend = require('extend');

gulp.task('default', ['build']);

gulp.task('build', function() {
	// Minified
	gulp.src('./src/plugin.js')
		.pipe(webpack(webpackConfig))
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));

	// Unminified
	gulp.src('./src/plugin.js')
		.pipe(webpack(extend(true, {}, webpackConfig, {
			output: { filename: 'bundle.js' }
		})))
		.pipe(gulp.dest('dist/'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch([
		'./**/*.js', 
		'./**/*.css',
		'./**/*.scss',
		// Except in these directories
		'!./node_modules/**',
		'!./dist/**'
	], ['build']);
});
