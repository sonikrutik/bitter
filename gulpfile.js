/*eslint key-spacing: false */
// Derived from: https://gist.github.com/emilniklas/39c076d97648f1666a84

// ============================================================
//   $ npm install --save-dev gulp-util node-notifier gulp vinyl-source-stream vinyl-buffer gulp-uglify gulp-sourcemaps gulp-livereload browserify watchify babelify gulp-ruby-sass gulp-autoprefixer gulp-rename
// ============================================================

function Workflow() {
  // Override workflow settings here

  // Example:
  // this.output.directory = 'public_html';
  // this.watch.script = '**/*.ts';

  this.input.directory = 'src/';
  this.input.script = 'index.jsx';
  this.output.script = 'app.js';
  this.watch.style = this.input.directory + '/' + this.input.style.replace(/.+?\.(.+)$/, '**/*.$1');
}

// ============================================================
// ============================================================

Workflow.prototype.output = {
  directory: 'public',     // Default output directory. Override with [this.output.directory]
  script:    'scripts.js', // Default output script. Override with [this.output.script]
  style:     'styles.css'  // Default output stylesheet. Override with [this.output.style]
};
Workflow.prototype.input = {
  directory: 'resources',     // Default input directory root. Override with [this.input.directory]
  script:    'script/app.js', // Default main script file. Override with [this.input.script]
  style:     'style/app.scss' // Default main stylesheet file. Override with [this.input.style]
};
Workflow.prototype.watch = {
  // Key/value pairs for watching files and running tasks. Key is task name, value is glob to watch.
  update: '**/*.php' // Key [update] does a live reload
};

var workflow = new Workflow();

var production = process.argv.indexOf('--production') !== -1;

// ------------------------------------------------------------
//     Imports
// ------------------------------------------------------------
var utilities = require('gulp-util');
var notifier = require('node-notifier');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

// ------------------------------------------------------------
//     Console
// ------------------------------------------------------------

var Console = {};

Console.notify = function (options) {
  options.title = options.title || 'Done';
  options.message = options.message || 'Check your terminal!';
  options.sound = options.sound || 'Pop';
  options.icon = options.icon || 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-bell-128.png';

  notifier.notify(options);
};

Console.notifyOptimistic = function (options) {
  options.contentImage = options.contentImage || 'https://www.secureauth.com/SecureAuth/media/Product/check-mark-11-512_4.png';

  Console.notify(options);
};

Console.notifyPessimistic = function (options) {
  options.contentImage = options.contentImage || 'https://cdn4.iconfinder.com/data/icons/simplicio/128x128/notification_error.png';

  Console.notify(options);
};

Console.log = function () {
  utilities.log.apply(utilities, arguments);

  var args = Array.prototype.slice.call(arguments);

  Console.notifyOptimistic({
    message: args.join(' ')
  });
};

Console.error = function (error) {
  utilities.log.call(utilities, utilities.colors.red(error));

  Console.notifyPessimistic({
    title:   error.name,
    message: error.message
  });

  this.emit('end');
};

// ------------------------------------------------------------
//     Script task
// ------------------------------------------------------------

var bundler = browserify({
  entries:      ['./' + workflow.input.directory + '/' + workflow.input.script],
  extensions:   ['.jsx'],
  debug:        true,
  cache:        {},
  packageCache: {}
})
  .transform('babelify', {
    presets: ['es2015', 'react']
  });

function bundle() {
  var stream = bundler.bundle()
    .on('error', Console.error)
    .pipe(source(workflow.output.script))
    .pipe(buffer());

  if (production) {
    stream
      .pipe(uglify())
      .on('error', Console.error);
  } else {
    stream
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write());
  }

  return stream
    .pipe(gulp.dest(workflow.output.directory))
    .pipe(livereload());
}

function watchBundle() {
  bundler = watchify(bundler);

  bundler.on('update', bundle);
  bundler.on('log', Console.log);

  return bundle();
}

gulp.task('script', bundle);
gulp.task('watchScript', watchBundle);

// ------------------------------------------------------------
//     Style task
// ------------------------------------------------------------

var sassOptions = {
  style:     (production) ? 'compressed' : 'expanded',
  sourcemap: !production,
  loadPath: [
    './node_modules/bootstrap-sass/assets/stylesheets/'
  ]
}

gulp.task('style', function () {
  var pipe = sass(workflow.input.directory + '/' + workflow.input.style, sassOptions)
    .on('error', Console.error)
    .pipe(autoprefixer({map: {inline: true}}));

  if (!production) {
    pipe.pipe(sourcemaps.write());
  }

  pipe
    .pipe(rename(workflow.output.style))
    .pipe(gulp.dest(workflow.output.directory))
    .pipe(livereload())
});

// ------------------------------------------------------------
//     Watch task
// ------------------------------------------------------------

gulp.task('watch', ['style', 'watchScript'], function () {
  livereload.listen();

  var watches = workflow.watch;

  for (var task in watches) {
    var glob = watches[task];

    if (task == 'update') {
      gulp.watch(glob, livereload.changed);
    } else {
      gulp.watch(glob, [task]);
    }
  }
});

// ------------------------------------------------------------
//     Default task
// ------------------------------------------------------------

gulp.task('default', ['script', 'style']);
