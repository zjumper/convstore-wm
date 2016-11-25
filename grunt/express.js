'use strict';

module.exports = {
  options: {
    // Override defaults here
  },
  dev: {
    options: {
      script: 'app/app.js'
    }
  },
  prod: {
    options: {
      script: 'app/app.js',
      node_env: 'production'
    }
  },
  test: {
    options: {
      script: 'app/app.js'
    }
  }
}
