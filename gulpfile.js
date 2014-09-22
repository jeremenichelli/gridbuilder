var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    package = require('./package.json');

gulp.task('scripts', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('assets/js/'))
});

gulp.task('styles', function () {
    return gulp.src('src/css/**/*.css')
        .pipe(minifyCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('assets/css/'))
});