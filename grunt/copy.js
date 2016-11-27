'use strict';

module.exports = {
  dist: {
    files: [{
      expand: true,
      dot: true,
      cwd: 'app',
      dest: 'dist',
      src: [
        '*.{ico,png,txt}',
        '.htaccess',
        '*.html',
        //'config/defaults.json',
        'img/**',
        'views/{,*/}*.html',
        'templates/{,*/}*.html',
        'fonts/*',
        //'schema/*',
        //'spec-files/*',
        'CNAME',
        'robots.txt',
        'styles/*.css',
        'javascript/*.js'
      ]
    },
    {
      expand: true,
      cwd: 'app',
      src: 'bower_components/**/*',
      dest: 'dist'
    }]
  },
  styles: {
    expand: true,
    cwd: 'app/styles',
    dest: '.tmp/styles/',
    src: '{,*/}*.css'
  }
};
