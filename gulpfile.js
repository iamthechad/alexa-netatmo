var gulp = require('gulp');
var del = require('del');
var zip = require('gulp-zip');

gulp.task('default', ['clean:dist', 'build:zip']);

gulp.task('build:zip', function() {
  return gulp.src(['./**', '!./dist'])
    .pipe(zip('netatmo.zip'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean:dist', function () {
  return del(['./dist']);
});