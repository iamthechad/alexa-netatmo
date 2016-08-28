var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('default', function() {
  return gulp.src('./**')
    .pipe(zip('netatmo.zip'))
    .pipe(gulp.dest('./dist'));
});