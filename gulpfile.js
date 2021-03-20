
const   gulp = require('gulp'),
        rollup = require('gulp-better-rollup'),
        babel = require('rollup-plugin-babel'),
        resolve = require('rollup-plugin-node-resolve'),
        commonjs = require('rollup-plugin-commonjs'),
        sourcemaps = require('gulp-sourcemaps'),
        uglify = require('gulp-uglify'),
        concat = require('gulp-concat');

/**
 * @param {*} callback 
 */
const buildJS = (callback) => {
    gulp.src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
    .pipe(concat('canvassignature.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));

    callback();
}

/**
 * @param {*} callback 
 */
const buildJSMinified = (callback) => {
    gulp.src('src/*.js')
    .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
    .pipe(concat('canvassignature.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));

    callback();
}

const watchJS = () => {
    gulp.watch("src/*.js", gulp.series(buildJS, buildJSMinified));
}

exports.default = watchJS;
exports.build = gulp.series(buildJS, buildJSMinified);