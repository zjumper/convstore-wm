'use strict';

module.exports = {
  bower: {
    files: ['bower.json'],
    tasks: ['bowerInstall']
  },
  js: {
    files: ['app/scripts/*.js', 'app/javascript/*.js', 'grunt/*.js'],
    tasks: ['copy:dist'],
    options: {
      livereload: true
    }
  },
  html: {
    files: ['app/**/*.html'],
    tasks: ['copy:dist'],
    options: {
      livereload: true
    }
  },
  css: {
    files: ['app/styles/*.css'],
    tasks: ['copy:dist'],
    options: {
      livereload: true
    }
  },
  gruntfile: {
    files: ['Gruntfile.js']
  },
  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      'app/{,*/}*.html',
      'app/{,*/}*.handlebars',
      '.tmp/styles/{,*/}*.css',
      'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
    ]
  },
  express: {
    files:  [ '**/*.js' ],
    tasks:  [ 'express:dev' ],
    options: {
      spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
    }
  }
};
