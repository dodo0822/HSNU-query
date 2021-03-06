var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var angularFilesort = require('gulp-angular-filesort');
var sourcemaps = require('gulp-sourcemaps');
var debug = require('gulp-debug');
var minifyCSS = require('gulp-minify-css');
var sass = require('gulp-sass');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var watch = require('gulp-watch');

var config = {
	app: {
		scss: ['app/css/app.scss'],
		views: ['app/**/*.html']
	}, vendor: {
		js: [
			'bower_components/angular/angular.js',
			'bower_components/angular-ui-router/release/angular-ui-router.js',
			'bower_components/angular-loading-bar/build/loading-bar.js',
			'bower_components/ngstorage/ngStorage.js',
			'bower_components/ngDialog/js/ngDialog.js',
			'bower_components/prefixfree/prefixfree.min.js'
		],
		css: [
			'bower_components/pure/pure-min.css',
			'vendor/loading-bar.css',
			'vendor/spinner.css',
			'bower_components/ngDialog/css/ngDialog.css',
			'bower_components/ngDialog/css/ngDialog-theme-default.css',
		]
	}
};

gulp.task('clean', function(cb){
	del(['./build/**'], cb);
});

gulp.task('vendorScripts', function(){
	gulp.src(config.vendor.js)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(concat('vendor.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('scripts', function(){
	gulp.src(['./app/js/**/*.js'])
		.pipe(angularFilesort())
		.pipe(ngAnnotate())
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('styles', function(){
	gulp.src(config.app.scss)
		.pipe(sass())
		.pipe(concat('app.css'))
		.pipe(gulp.dest('./build/css'));

	gulp.src(config.vendor.css)
		.pipe(concat('vendor.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./build/css'));
});

gulp.task('assets', function(){
	gulp.src(['./bower_components/font-awesome/fonts/*'])
		.pipe(gulp.dest('./build/fonts'));

	gulp.src(['./app/img/**/*.*'])
		.pipe(gulp.dest('./build/img'));
});

gulp.task('views', function(){
	gulp.src(config.app.views)
		.pipe(gulp.dest('./build'));
});

gulp.task('watch', ['default'], function(){
	watch(['app/**/*.js'], function(files, cb){
		gulp.start('scripts', cb);
	});
	watch(['app/**/*.scss'], function(files, cb){
		gulp.start('styles', cb);
	});
	watch(['app/**/*.html'], function(files, cb){
		gulp.start('views', cb);
	});
});

gulp.task('default', ['views', 'assets', 'vendorScripts', 'scripts', 'styles']);
