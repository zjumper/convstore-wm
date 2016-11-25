var config = require('./config'),
  log4js = require('log4js');

module.exports = (function () {
  var logger = log4js.getLogger('normal');
  return {
    getProductList: function (req, res) {
      logger.debug('Get product list hit.');
    },
  };
})();
