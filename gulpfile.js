var gulp = require('gulp');
var eslint = require('gulp-eslint');
var del = require('del');
var zip = require('gulp-zip');

gulp.task('default', ['clean:dist', 'lint', 'build:zip']);

gulp.task('build:zip', function() {
  return gulp.src([
    './*.js',
    '!./gulpfile.js',
    './lib/**',
    '!./dist',
    './node_modules/alexa-app/**',
    './node_modules/alexa-utterances/**',
    './node_modules/bluebird/**',
    './node_modules/numbered/**',
    './node_modules/js-combinatorics/**'
  ], {base: '.'})
    .pipe(zip('netatmo.zip'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean:dist', function () {
  return del(['./dist']);
});

gulp.task('lint', function() {
  return gulp.src(['./lib/**/*.js','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});