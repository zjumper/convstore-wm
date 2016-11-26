'use strict';

module.exports = function(grunt) {
  require('load-grunt-config')(grunt);

  // grunt.initConfig({
  //   wiredep: {
  //     app: {
  //       // Point to the files that should be updated when
  //       // you run `grunt wiredep`
  //       src: [
  //         'app/**/*.html'   // .html support...
  //         //'app/views/**/*.jade',   // .jade support...
  //         //'app/styles/main.scss',  // .scss & .sass support...
  //         //'app/config.yml'         // and .yml & .yaml support out of the box!
  //       ],
  //
  //       options: {
  //         // See wiredep's configuration documentation for the options
  //         // you may pass:
  //         // https://github.com/taptapship/wiredep#configuration
  //       }
  //     }
  //   }
  // });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build',
        'express:prod'
        // 'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'express:dev',
      // 'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'copy:dist'
  ]);
}
