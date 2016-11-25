'use strict';

module.exports = function(grunt) {
  require('load-grunt-config')(grunt);

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'less:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });
}
