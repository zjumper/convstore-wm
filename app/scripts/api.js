var config = require('./config'),
  crypto = require('crypto'),
  log4js = require('log4js');

module.exports = (function () {
  var logger = log4js.getLogger('normal');
  return {
    getProductList: function (req, res) {
      //logger.debug('Get product list hit.');
      res.json({msg:'productList'});
    },
    wx: function(req, res) {
      var nonce = req.query.nonce || '';
      var timestamp = req.query.timestamp || '';
      var list = [nonce, timestamp, config.TOKEN].sort();
      logger.debug(list);
      var sig = req.query.signature || '';
      var echo = req.query.echostr || '';
      var hasher = crypto.createHash('sha1');
      hasher.update(list.join(''));
      var hex = hasher.digest('hex');
      logger.debug('Original signature: ' + sig + ', hash value: ' + hex);
      if(hex === sig)
        res.send(echo);
      else res.send('error');
    }
  };
})();
