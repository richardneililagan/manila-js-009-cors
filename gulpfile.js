'use strict';

var gulp = require('gulp');
var rimraf = require('rimraf');
var run = require('run-sequence');
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
    '!./.tmp/**/*.min.js'
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
gulp.task('process-scripts', function (cb) {
  run(['jshint:server', 'minify:js'], cb);
});


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
    '!./.tmp/**/*.min.css'
    ])
    .pipe($.cssmin())
    .pipe($.rename(function(path) {
      // again, assuming no .min.css streams
      path.basename += '.min';
    }))
    .pipe(gulp.dest('./.tmp'))

    // 'cause I just wanna see this information
    .pipe($.size({
      showFiles : true
    }))
    ;
});

// provess CSS workflow
// # kinda redundant though
gulp.task('process-styles', function (cb) {
  run(['minify:css'], cb);
});


// :: Cleaning
var _clean = function (path) {
  return function (cb) {
    rimraf(path, cb);
  };
};

gulp.task('clean:stage', _clean('./.tmp'));
gulp.task('clean:css', _clean('./dist/pub/css'));
gulp.task('clean:js', _clean('./dist/pub/js'));
gulp.task('clean:images', _clean('./dist/pub/images'));
gulp.task('clean:views', _clean('./dist/views'));
gulp.task('clean:dist', _clean('./dist'));
//
// or clean them all
gulp.task('clean', function (cb) {
  run(['clean:dist', 'clean:stage'], cb);
});


// :: Packaging
var _copy = function (from, base, to) {
  return function () {
    return gulp.src(from, { base : base || './client' })
      .pipe(gulp.dest(to || './dist'))
      .pipe($.livereload({ auto : false }))
      ;
  };
};

gulp.task('copy:views', _copy('./client/views/**/*.*'));
gulp.task('copy:images', _copy('./client/images/**/*.*', null, './dist/pub/images'));
gulp.task('copy:js', ['process-scripts'], _copy('./.tmp/**/*.min.js', './.tmp', './dist/pub/js'));
gulp.task('copy:css', ['process-styles'], _copy('./.tmp/**/*.min.css', './.tmp', './dist/pub/css'));

gulp.task('build', function (cb) {
  run(
    'clean',
    ['copy:images', 'copy:views', 'copy:js', 'copy:css'],
    cb
    );
});


// :: Watch
gulp.task('watch', function () {

  $.livereload.listen();

  gulp.watch('./client/views/**/*.*', ['copy:views']);
  gulp.watch('./client/images/**/*.*', ['copy:images']);
  gulp.watch('./client/scripts/**/*.*', ['copy:js']);
  gulp.watch('./client/styles/**/*.*', ['copy:css']);

});


// :: Server
gulp.task('serve', function () {
  $.nodemon({
    script : 'app.js',
    ext : 'js',
    ignore : [
      './client',
      './dist',
      './.tmp',
      './.sass-cache'
    ]
  })
  .on('change', ['jshint:server'])
  ;
});