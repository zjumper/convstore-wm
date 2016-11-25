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
        'images/{,*/}*.{webp}',
        'views/{,*/}*.html',
        'templates/{,*/}*.html',
        'fonts/*',
        //'schema/*',
        //'spec-files/*',
        'CNAME',
        'robots.txt',
        'styles/main.css',
        'javascript/*.js'
      ]
    },
    {
      expand: true,
      cwd: '.tmp/images',
      dest: 'dist/images',
      src: ['generated/*']
    },
    {
      expand: true,
      cwd: '.',
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
