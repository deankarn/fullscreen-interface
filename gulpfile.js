"use strict";
/**
* Dependencies
*/
var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var concat = require("gulp-concat");
var less = require("gulp-less");
var coffee = require("gulp-coffee");
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");

// Config
var config = require("./app/config/gulp");
var paths = config.paths;

// Hack around nodemon, that doesn"t wait for tasks to finish on change
var nodemon_instance;

function handleStreamError (err) {
    console.log(err.toString());
    this.emit("end");
}

gulp.task("less-compile", function () {
    return gulp.src(paths.in.less)
    .pipe(sourcemaps.init())
    .pipe(less())
    .on("error", handleStreamError)
    .pipe(concat("style.css"))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.out.static));
});

gulp.task('coffee-compile', function() {
    gulp.src(paths.in.cs)
    .pipe(coffee({bare: true}).on('error', handleStreamError))
    .pipe(gulp.dest(paths.out.static));
});

gulp.task("install", ["less-compile", "coffee-compile"]);

gulp.task("watch", function () {
    gulp.watch(paths.watch.less, ["less-compile"]);
    gulp.watch(paths.watch.cs, ["coffee-compile"]);
    gulp.watch(paths.watch.app, ["nodemon"]);
});

gulp.task("nodemon", function () {
    if(!nodemon_instance)
        nodemon_instance = nodemon({ script:"server.js", nodeArgs: ["--harmony", "--debug"],
        env: { "NODE_ENV": "development" }, watch: "__manual_watch__",  ext: "__manual_watch__"  });
    else {
        nodemon_instance.emit("restart");
    }
});

/**
* Global tasks
*/
gulp.task("dev", ["install", "watch", "nodemon"]);

gulp.task("default", ["install"]);
