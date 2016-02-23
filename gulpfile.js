var babelify = require('babelify');
var browserify = require('browserify');
var browserifyInc = require('browserify-incremental');
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var sassify = require('sassify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var path = require('path');
var fs = require('fs');
var del = require('del');
var watchify = require('watchify');
var jade = require('gulp-jade');
var browserSync = require('browser-sync').create();

var LIVE = false;
var DEBUG = true;
process.env.NODE_ENV = 'development';

const modulePaths = [
  './node_modules',
  './src/components',
  './src/modules',
  './src/sass'
];

function compile(appPath) {
  var moduleExt = path.extname(appPath);
  var moduleName = path.basename(appPath, moduleExt);
  var outputName = moduleName + '.js';
  var props = {
    debug: DEBUG,
    extensions: ['.js', '.jsx', 'scss'],
    entries: appPath,
    paths: modulePaths,
    cache: {},
    packageCache: {},
    fullPaths: LIVE,
    baseDir: __dirname
  };

  var bundle = LIVE ? watchify(browserify(props)) : browserify(props);

  function writeBundle() {
    return bundle.bundle()
      .on("error", (e) => gutil.log(e.message))
      .pipe(source(outputName))
      .pipe(gulpif(!DEBUG, streamify(uglify())))
      .pipe(gulp.dest('./dist/assets/js'));
  }

  bundle
    .on("file", (file) => gutil.log('\t', gutil.colors.yellow("Building"), gutil.colors.bold(file)))
    .transform(sassify, {
      'auto-inject': true,
      base64Encode: false,
      sourceMap: DEBUG
    })
    .transform(babelify, {
      presets: ['babel-preset-es2015', 'babel-preset-react']
    })
    .add(require.resolve("babel-polyfill"));

  browserifyInc(bundle, {
    cacheFile: './browserify-cache.json'
  });

  if (LIVE) {
    bundle.on("update", (file) => {
      gutil.log('Updating ' + file);
      writeBundle();
    });
  }

  return writeBundle();
}

gulp.task('live', function() {
  LIVE = true;
  DEBUG = true;
  process.env.NODE_ENV = 'development';
  browserSync.init({
      server:{
          baseDir:'./dist'
      },
      port:7171,
      files: './dist/**/*'
  });
});

gulp.task('production', function() {
  DEBUG = false;
  process.env.NODE_ENV = 'production';
});

gulp.task('print-mode', function() {
  var mode;

  if (DEBUG) {
    mode = gutil.colors.yellow('DEVELOPMENT');
  } else {
    mode = gutil.colors.red('PRODUCTION');
  }

  gutil.log('');
  gutil.log('-->', mode, gutil.colors.bold(' MODE'), '<--');
  gutil.log('');
});

gulp.task('apps', function() {
  return compile('./src/apps/login.jsx');
});

gulp.task('views', function() {
  return gulp.src('./src/views/**/*.jade')
    .pipe(jade({
      client: false
    }))
    .pipe(gulp.dest('./dist/'));

});

gulp.task('clean', function() {
  return del([
    './browserify-cache.json',
    './dist/*/*'
  ]);
});

gulp.task('static', function() {
  return gulp.src(['./src/static/**/*']).pipe(gulp.dest('./dist/assets/'));
});

gulp.task('rebuild', gulpsync.sync(['clean', 'build']), function() {

});

gulp.task('build', gulpsync.sync(['print-mode', 'views', 'static', 'apps']), function() {

});

gulp.task('default', ['build'], function() {

});
