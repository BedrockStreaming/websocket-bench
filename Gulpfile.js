/*global require*/

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  mocha = require('gulp-mocha'),
  jshint = require('gulp-jshint'),
  bump = require('gulp-bump'),
  stylish = require('jshint-stylish');


//Application Paths
var paths = {
  js    : [
    './lib/**/*.js',
    './gulpfile.js',
    './index.js'
  ],
  tests : [
    'test/functional/faye.js',
    'test/functional/io.js',
    'test/lib/baseworker.js',
    'test/lib/benchmark.js',
    'test/lib/fayeworker.js',
    'test/lib/logger.js',
    'test/lib/monitor.js',
    'test/lib/socketioworker.js',
    'test/lib/steps.js',
    'test/lib/stopwatch.js'
  ],

  bump : [
    './package.json'
  ]
};

//Gulp Tasks
gulp.task('jshint', function () {
  gulp.src(paths.js)
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('mocha', function (done) {
  gulp.src(paths.tests)
    .pipe(mocha({
      bail     : true,
      lookup   : true,
      ui       : 'bdd',
      reporter : 'spec'
    }))
    .on("error", gutil.log);
});

//Version Bump (gulp bump-major | bump-minor | bump-patch)

gulp.task('bump-major', function () {
  return gulp.src(paths.bump)
    .pipe(bump({type : 'major'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', function () {
  return gulp.src(paths.bump)
    .pipe(bump({type : 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-patch', function () {
  return gulp.src(paths.bump)
    .pipe(bump({type : 'patch'}))
    .pipe(gulp.dest('./'));
});


//Gulp Runner
gulp.task('default', ['jshint', 'mocha']);