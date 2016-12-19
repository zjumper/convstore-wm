var config = require('./config'),
  json = require('json3'),
  crypto = require('crypto'),
  https = require('https'),
  log4js = require('log4js');

module.exports = (function () {
  var logger = log4js.getLogger('normal');
  return {
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
        res.status(200).send(echo);
      else res.status(200).send('error');
    },
    auth: function(req, res) {
      var code = req.query.code;
      var state = req.query.state;
      logger.info(code);
      logger.info(state);

      if(code) {
        // request access_token
        var options = {
          hostname: 'api.weixin.qq.com',
          path: '/sns/oauth2/access_token?appid=wxfb8982fe794a85a7&secret=1f05f82c9aa8192dd09b345a9ec5e2cc&secret=1f05f82c9aa8192dd09b345a9ec5e2cc&code=' + code + '&grant_type=authorization_code',
          method: 'GET'
        };
        var req = https.request(options, (res) => {
          res.on('data', (d) => {
            var retd = json.parse(d);
            logger.info(retd);
            if(retd.access_token) {
              // request user info
              var opt = {
                hostname: 'api.weixin.qq.com',
                path: '/sns/userinfo?access_token=' + retd.access_token + '&openid=' + retd.openid + '&lang=zh_CN',
                method: 'GET'
              };
              var req2 = https.request(opt, (res) => {
                res.on('data', (u) => {
                  var user = json.parse(u)
                  logger.info(user);
                  if(user.openid) {
                    res.redirect('/index.html?openid=' + user.openid + '&pic=' + user.headimgurl);
                  }
                });
              });
              req2.end();
              req2.on('error', logger.error);
            }
          });
        });
        req.end();
        req.on('error', logger.error);
      }
    }
  };
})();
