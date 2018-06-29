'use strict'

import gulp from 'gulp';
import babel from 'gulp-babel';

const watch = require('gulp-watch'),
		plumber = require('gulp-plumber'),
		gulpsass = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		cleanCss = require('gulp-clean-css'),
		sourcemaps = require('gulp-sourcemaps'),
		concat = require('gulp-concat'),
		jshint = require('gulp-jshint'),
		uglify = require('gulp-uglify'),
		imagemin = require('gulp-imagemin'),
		livereload = require('gulp-livereload'),
		notify = require('gulp-notify')

let onError = function(err){
	console.log('Se ha producido un error: ', err.message);
	this.emit('end');
}

gulp.task('sass', function(){
	return gulp.src('./sass/style.scss')
		.pipe(plumber({errorHandler: onError}))
		// Iniciamos el trabajo con sourcemaps
		.pipe(sourcemaps.init())
		.pipe(gulpsass())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('.'))
		//.pipe(cleanCss({keepSpecialComments: 1}))
		// Escribir los sourcemaps
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.'))
		.pipe(livereload())
		.pipe(notify({message: 'Sass task finalizada'}))
});

gulp.task('lint', function () {
	return gulp.src('./js/dev/**.js')
		.pipe(jshint())
});

gulp.task('javascript', ['lint'], function() {
	return gulp.src('./js/dev/**.js')
		.pipe(babel())
		.pipe(plumber({ errorHandler: onError }))
		//.pipe(concat('index.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./js'))
		.pipe(livereload())
		.pipe(notify({ message: 'JavaScript task finalizada' }))
});

gulp.task('imagemin', function () {
	return gulp.src('./img/dev/**.*')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('./img/'))
		.pipe(livereload())
		.pipe(notify({ message: 'Imagemin task finalizada' }))
});

gulp.task('watch', function () {
	livereload.listen();
	gulp.watch('./sass/**/**.scss', ['sass'])
	gulp.watch('./js/dev/**.js', ['javascript'])
	gulp.watch('./img/dev/**.*', ['imagemin'])

});

gulp.task('default', ['sass', 'javascript', 'imagemin', 'watch'], function(){

});