#!/usr/bin/env node

"use strict";

/* ########################################## */
/* ########### load requirements ############ */
/* ########################################## */

var
// node modules
	fs = 					require('fs'),
	semver =			require('semver'),
// gulp & plugins
	gulp =				require('gulp'),
	plumber =			require('gulp-plumber'),
	jshint =			require('gulp-jshint'),
	rename =			require('gulp-rename'),
	replace =			require('gulp-replace-task'),
	concat =			require('gulp-concat-util'),
	uglify =			require('gulp-uglify'),
	gutil = 			require('gulp-util'),
	jeditor = 		require('gulp-json-editor'),
	size = 				require('gulp-size'),
// package info
	info =				require('./package.json');

// command line options (use gulp -h to for details)
var args = require('yargs')
						.usage('Usage: gulp [options]')
						.describe('b', 'Bumps version number. Accepts \'patch\', \'minor\' and \'major\'.')
							.alias('b', 'bump')
						.help('h')
							.alias('h', '?')
						// examples
						.example("$0 --bump=patch", 	'build and update version number from to 1.1.1 to 1.1.2')
						.example("$0 -b", 						'same as above, as \'patch\' is default')
						.argv;


/* ########################################## */
/* ########### validate parameters ########## */
/* ########################################## */

// bump
if (args.bump) {
	var validBumps = ["patch", "minor", "major"];
	if (args.bump === true) {
		args.b = args.bump = validBumps[0];
	} else if (validBumps.indexOf(args.bump) === -1) {
		gutil.log("Supplied option for bump ('" + args.bump + "') is invalid. Allowed values are: '" + validBumps.join("', '") + "'");
		process.exit(1);
	}
}

/* ########################################## */
/* ################# options ################ */
/* ########################################## */

var options = {
	version: args.bump ? semver.inc(info.version, args.bump) : info.version,
	banner: {
		uncompressed: fs.readFileSync('src/banner.regular.txt',  'utf-8') + "\n",
		minified: fs.readFileSync('src/banner.min.txt', 'utf-8') + "\n"
	}
};

/* ########################################## */
/* ############### MAIN TASKS ############### */
/* ########################################## */

gulp.task('default', ['sync-json-files', 'build'], function () {
	if (args.bump) {
		gutil.log("Bumped version number from v" + info.version + " to v" + options.version);
	}
});

gulp.task('sync-json-files', function() {
	var syncInfo = {
		version: options.version
	};
	["main", "description", "keywords", "homepage", "license", "repository"].forEach(function(key) {
		syncInfo[key] = info[key];
	});
	return gulp.src(["./package.json", "./bower.json"])
			.pipe(jeditor(syncInfo, {keep_array_indentation: true}))
			.pipe(gulp.dest("./"));
});

gulp.task('lint', function() {
	return gulp.src("src/*.js")
		.pipe(jshint({lookup: false}))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('build', ['lint'], function() {
	var replacePatterns = {
		patterns: [
			{
				match: /%VERSION%/gm,
				replacement: options.version
			}
		]
	};
	return gulp.src("src/*.js")
		// make uncompressed
		.pipe(plumber())
		.pipe(concat.header(options.banner.uncompressed))
		.pipe(replace(replacePatterns))
    .pipe(size({showFiles: true}))
		.pipe(gulp.dest('./'))
		// make minified
		.pipe(uglify())
		.pipe(concat.header(options.banner.minified))
		.pipe(replace(replacePatterns))
		.pipe(rename({suffix: ".min"}))
    .pipe(size({showFiles: true}))
		.pipe(gulp.dest('./'));
});