'use strict';

var gulp = require('gulp');
var rimraf = require('rimraf');
var $ = require('gulp-load-plugins')();


// :: JS

// javascript linting
gulp.task('jshint:client', function () {
  return gulp.src([
    'client/scripts/**/*.js',
    '!client/scripts/lib/**/*.js'
    ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    ;
});
gulp.task('jshint:server', function () {
  return gulp.src([
    'server/**/*.js',
    './app.js',
    './gulpfile.js'
    ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    ;
});
gulp.task('jshint', ['jshint:client', 'jshint:server']);

// parse client CJS syntax
gulp.task('browserify', ['jshint:client'], function () {
  return gulp.src('client/scripts/app.js')
    .pipe($.browserify())
    .pipe(gulp.dest('./.tmp'))
    ;
});

// stage javascript libraries
gulp.task('libscripts', function () {
  return gulp.src('client/scripts/lib/**/*.js', { base : 'client/scripts/lib' })
    .pipe(gulp.dest('./.tmp'))
    ;
});

// minify javascript
gulp.task('minify:js', ['browserify', 'libscripts'], function () {
  return gulp.src([
    './.tmp/**/*.js',
    '!*.min.js'
    ])
    .pipe($.uglify({
      preserveComments : 'some'
    }))
    .pipe($.rename(function (path) {
      // assuming no .min.js streams
      path.basename += '.min';
    }))
    .pipe(gulp.dest('./.tmp'))

    // 'cause I just wanna see this information
    .pipe($.size({
      showFiles : true
    }))
    ;
});

// process javascript workflow
gulp.task('process-scripts', ['jshint:server', 'minify:js']);


// :: CSS

// parse SASS files
gulp.task('sass', function () {
  return gulp.src('client/styles/style.scss')
    .pipe($.rubySass({
      style : 'expanded',
      precision : 10,
      loadPath : ['client/styles/lib', 'client/styles/src']
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('./.tmp'))
    ;
});

// minify CSS
gulp.task('minify:css', ['sass'], function () {
  return gulp.src([
    './.tmp/**/*.css',
    '!*.min.css'
    ])
    .pipe($.cssmin())
    .pipe($.rename(function(path) {
      // again, assuming no .min.css streams
      path.basename += '.min';
    }))
    .pipe(gulp.dest('./.tmp'))
    ;
});

// provess CSS workflow
// # kinda redundant though
gulp.task('process-styles', ['minify:css']);


// :: Cleaning
var _clean = function (path) {
  return function (cb) {
    rimraf(path, cb);
  };
};

gulp.task('clean:stage', _clean('./.tmp'));
gulp.task('clean:css', _clean('./dist/css'));
gulp.task('clean:js', _clean('./dist/js'));
gulp.task('clean:images', _clean('./dist/images'));
gulp.task('clean:views', _clean('./dist/views'));
//
// or clean them all
// # gotta make this task and clean:stage run in parallel
gulp.task('clean', ['clean:stage'], _clean('./dist'));


// :: Packaging
var _copy = function (from, base, to) {
  return function () {
    return gulp.src(from, { base : base || './client' })
      .pipe(gulp.dest(to || './dist'))
      .pipe($.livereload({ auto : false }))
      ;
  };
};

gulp.task('copy:images', ['clean:images'], _copy('./client/images/**/*.*'));
gulp.task('copy:views', ['clean:views'], _copy('./client/views/**/*.*'));
gulp.task('copy:js', ['clean:js'], _copy('./.tmp/**/*.min.js', './.tmp', './dist/js'));
gulp.task('copy:css', ['clean:css'], _copy('./.tmp/**/*.min.css', './.tmp', './dist/css'));