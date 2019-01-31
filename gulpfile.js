
// Add our dependencies
var gulp = require('gulp'), // Main Gulp module
    concat = require('gulp-concat'), // Gulp File concatenation plugin
    open = require('gulp-open'), // Gulp browser opening plugin
    connect = require('gulp-connect'), // Gulp Web server runner plugin
    ghPages = require('gulp-gh-pages'); // Gulp Web server runner plugin

// Configuration
var configuration = {
    paths: {
        src: {
            html: './*.html',
            js: [
                "./js/*.js"
            ]
        },
        dist: './dist'
    },
    localServer: {
        port: 8000,
        host: '0.0.0.0',
        url: 'http://0.0.0.0:8000/'
    }
};

// Gulp task to copy HTML files to output directory
gulp.task('html', function () {
    gulp.src(configuration.paths.src.html)
        .pipe(gulp.dest(configuration.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src(configuration.paths.src.js)
        .pipe(gulp.dest(configuration.paths.dist + '/js'))
        .pipe(connect.reload());
});

// Gulp task to create a web server
gulp.task('connect', function () {
    connect.server({
        root: 'dist',
        host: configuration.localServer.host,
        port: configuration.localServer.port,
        livereload: true
    });
});

// Gulp task to open the default web browser
gulp.task('open', function () {
    gulp.src('dist/index.html')
        .pipe(open({ uri: configuration.localServer.url }));
});

// Watch the file system and reload the website automatically
gulp.task('watch', function () {
    gulp.watch(configuration.paths.src.html, ['html']);
    gulp.watch(configuration.paths.src.js, ['js']);
    gulp.watch(configuration.paths.src.data, ['data']);
    gulp.watch(configuration.paths.src.jsartoolkit5, ['artoolkit']);
    gulp.watch(configuration.paths.src.threex, ['threex']);
});

gulp.task("build", ['html', 'js']);

// Gulp default task
gulp.task('default', ['html', 'js', 'connect', 'watch']);

gulp.task("deploy", ["build"], () => {
    return gulp.src('dist/**/*', { dot: true })
        .pipe(ghPages({
            force: true
        }));
});
