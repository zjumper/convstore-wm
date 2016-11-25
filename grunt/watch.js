'use strict';

module.exports = {
  bower: {
    files: ['bower.json'],
    tasks: ['bowerInstall']
  },
  js: {
    files: ['app/scripts/{,*/}*.js', 'app/libs/{,*/}*.js', 'grunt/*.js'],
    tasks: ['jshint:all', 'jscs'],
    options: {
      livereload: true
    }
  },
  html: {
    files: ['app/**/*.html'],
    options: {
      livereload: true
    }
  },
  jsTest: {
    files: ['test/spec/{,*/}*.js'],
    tasks: ['jshint:test', 'jscs:test', 'karma:main']
  },
  less: {
    files: ['app/styles/{,*/}*.less'],
    tasks: ['less:server', 'autoprefixer']
  },
  gruntfile: {
    files: ['Gruntfile.js']
  },
  handlebars: {
    files: ['app/{,*/}*.handlebars', 'app/swagger-ui/main/template/*.handlebars'],
    tasks: ['handlebars:compile']
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
