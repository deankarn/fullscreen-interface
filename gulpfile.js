"use strict";
/**
* Dependencies
*/
var gulp = require("gulp");
var supervisor = require("gulp-supervisor");
var livereload = require('gulp-livereload');
var concat = require("gulp-concat");
var less = require("gulp-less");
var coffee = require("gulp-coffee");
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");
var mocha = require('gulp-mocha');

// Config
var config = require("./app/config/gulp");
var paths = config.paths;

function handleStreamError (err) {
    console.log(err.toString());
    this.emit("end");
}

gulp.task("copy-js", function ()
{
    return gulp.src(paths.in.js)
    .pipe(gulp.dest(paths.out.static))
    .pipe(livereload());
});

gulp.task("less-compile", function ()
{
    return gulp.src(paths.in.less)
    .pipe(sourcemaps.init())
    .pipe(less())
    .on("error", handleStreamError)
    .pipe(concat("style.css"))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.out.static))
    .pipe(livereload());
});

gulp.task('coffee-compile', function ()
{
    return gulp.src(paths.in.cs)
    .pipe(coffee(
    {
        bare: true
    }).on('error', handleStreamError))
    .pipe(gulp.dest(paths.out.static))
    .pipe(livereload());
});

gulp.task("install", ["copy-js", "less-compile", "coffee-compile"]);

gulp.task("watch", function ()
{
    livereload.listen();
    gulp.watch(paths.watch.less, ["less-compile"]);
    gulp.watch(paths.watch.cs, ["coffee-compile"]);
    gulp.watch(paths.watch.js, ["copy-js"]);
});

gulp.task("supervisor-dev", function ()
{
    supervisor(paths.app.server,
    {
        args: [],
        watch: [paths.watch.app],
        ignore: [paths.ignore.app],
        pollInterval: 500,
        extensions: ["js"], // ignored when watching directory
        exec: "node",
        debug: true,
        debugBrk: false,
        harmony: true,
        noRestartOn: "exit",
        forceWatch: false, // want to turn to true for lower CPU usage, but the is a bug, filed issue #143
        quiet: false
    });
});

gulp.task("supervisor-prod", function ()
{
    supervisor(paths.app.server,
    {
        args: [],
        watch: [''],
        ignore: [],
        pollInterval: 500,
        extensions: [""], // ignored when watching directory
        exec: "node",
        debug: false,
        debugBrk: false,
        harmony: true,
        noRestartOn: "exit",
        forceWatch: false, // want to turn to true for lower CPU usage, but the is a bug, filed issue #143
        quiet: true
    });
});

gulp.task('mocha-test',['install'], function() {
    return gulp.src(paths.app.test, {read:false})
    .pipe(mocha({reporter: 'nyan'}));
});

/**
* Global tasks
*/
gulp.task("dev", ["install", "watch", "supervisor-dev"]);
gulp.task("test", ["install", "mocha-test"]);
gulp.task("default", ["install", "supervisor-prod"]);
