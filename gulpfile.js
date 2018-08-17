var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    babel = require('gulp-babel'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();


let paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.scss',
    srcJS: 'src/js/main.js',

    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js',
}

gulp.task('html', function () {
    return gulp.src(paths.srcHTML)
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

gulp.task('css', function () {
    gulp.src(paths.srcCSS)
        .pipe(sass({ style: 'expanded' }))
        .on('error', gutil.log)
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return browserify(paths.srcJS)
        .bundle()
        .pipe(source('js/bundle.js'))
        .pipe(buffer())
        .pipe(babel())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

gulp.task('copy', ['html', 'css', 'js']);

gulp.task('inject', ['copy'], function () {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['inject'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });

    gulp.watch(paths.srcCSS, ['css']);
    gulp.watch(paths.srcJS, ['js']);
    gulp.watch(paths.srcHTML, ['inject']);
});



gulp.task('default', ['html', 'serve']);