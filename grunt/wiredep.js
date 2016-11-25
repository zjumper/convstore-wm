'use strict';

module.exports = {
  app: {
    // Point to the files that should be updated when
    // you run `grunt wiredep`
    src: [
      'app/**/*.html'   // .html support...
      //'app/views/**/*.jade',   // .jade support...
      //'app/styles/main.scss',  // .scss & .sass support...
      //'app/config.yml'         // and .yml & .yaml support out of the box!
    ],

    options: {
      // See wiredep's configuration documentation for the options
      // you may pass:
      // https://github.com/taptapship/wiredep#configuration
    }
  }
}
