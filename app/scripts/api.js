var config = require('./config'),
  json = require('json3'),
  crypto = require('crypto'),
  https = require('https'),
  redis = require('redis'),
  client = redis.createClient(),
  log4js = require('log4js');

module.exports = (function () {
  var logger = log4js.getLogger('normal');
  function initAccessToken(cb) {

    // request access_token
    var options = {
      hostname: 'api.weixin.qq.com',
      path: '/cgi-bin/token?grant_type=client_credential&appid=wxfb8982fe794a85a7&secret=1f05f82c9aa8192dd09b345a9ec5e2cc',
      method: 'GET'
    };
    var req = https.request(options, (res) => {
      // console.log('statusCode:', res.statusCode);
      // console.log('headers:', res.headers);
      res.on('data', (d) => {
        var token = json.parse(d).access_token;
        // TODO store access_token into reids
        client.set(config.KEY_ACCESS_TOKEN, token);
        client.send_command('expire', [config.KEY_ACCESS_TOKEN, 7200]);
        // request jsapi_ticket
        options.path = '/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi';
        var req2 = https.request(options, (res2) => {
          res2.on('data', (data) => {
            var ticket = json.parse(data).ticket;
            //TODO store jsapi_ticket into redis
            client.set(config.KEY_JSAPI_TICKET, ticket);
            client.send_command('expire', [config.KEY_JSAPI_TICKET, 7200]);
            // all requesting done, refresh them after 7200 seconds
            setTimeout(initAccessToken, 7200000);
            // if there's callback function, call it
            if(cb)
              cb(token, ticket);
          });
        });
        req2.end();
        req2.on('error', () => {
          // requesting jsapi_ticket fails
          console.error(e);
          // setTimeout(initAccessToken, 1000);
        });
      });
    });
    req.end();
    req.on('error', (e) => {
      // requesting access_token fails
      console.error(e);
      // setTimeout(initAccessToken, 1000);
    });
    return true;
  }

  return {
    getProductList: function (req, res) {
      //logger.debug('Get product list hit.');
      res.status(200).json({msg:'productList'});
    },
    getWxToken: function(cb) {
      client.get(config.KEY_ACCESS_TOKEN, function(err, reply) {
        if(reply === undefined || reply === null) {
          logger.info('ACCESS_TOKEN expired, refresh it.');
          initAccessToken();
        } else if(cb) {
          cb(reply.toString());
        }
      });
    },
    getUserInfo: function(req, res) {
      var json = {};
      // load user info from session
      if(req.session.user)
        json = req.session.user;
      res.status(200).json(json);
    }
  };
})();
