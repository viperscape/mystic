'use strict';
const gulp = require("gulp");
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const source = require('vinyl-source-stream');
const browserify = require('browserify');

gulp.task('default', ['build'], function() {
    gulp.watch('**/*.ts', ['typescript']);
    gulp.watch('static/**/*.*', ['static']);
});

gulp.task('typescript', function() {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
		.pipe(tsProject());
	
	return tsResult.js.pipe(gulp.dest('build'));
});

/// copy static assets
gulp.task('static', function() {
    setTimeout(function() {
        return gulp.src(['static/**/*.*','!static/**/*.blend*'])
            .pipe(gulp.dest("build"));
    }, 1500);
});

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

// we want to copy locally the collada loader file
gulp.task('support', function() {
    return gulp.src(["node_modules/three/examples/js/loaders/ColladaLoader.js"])
        .pipe(gulp.dest("build/game/support"));
});

gulp.task('build', ['support','static','typescript']);