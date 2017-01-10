var config = require('./config'),
  json = require('json3'),
  crypto = require('crypto'),
  https = require('https'),
  redis = require('redis'),
  _ = require('underscore'),
  dateformat = require('dateformat'),
  angoose = require('angoose'),
  client = redis.createClient(),
  Stomp = require('stomp-client'),
  log4js = require('log4js'),
  Stomp = require('stomp-client'),
  randomstring = require('randomstring');

module.exports = (function () {
  var logger = log4js.getLogger('normal');
  config.client = new Stomp(config.STOMP_HOST, config.STOMP_PORT, config.STOMP_USER, config.STOMP_PASSWD);
  config.client.connect(function(sessionId) {
    console.log(sessionId);
  });

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

  function saveOrder(Order, order, u, res) {
    var o = new Order({});
    o.submittime = dateformat(new Date(), 'yyyymmddHHMMss');
    o.orderid = o.submittime + randomstring.generate(8);
    o.contact = order.contact;
    o.schedule = order.schedule;
    o.comment = order.comment;
    o.contact.openid = u.openid;
    o.total = order.total;
    o.products = [];
    for(var i in order.products) {
      var p = order.products[i];
      p.pid = i;
      o.products.push(p);
    }
    o.status = 0;
    // logger.info(o);
    o.save(function(err) {
      if(err) {
        logger.error(err);
        res.status(500).json({status : 500});
        return;
      }
      else logger.info('Order info saved.');
      // send order message to MQ
      config.client.publish(config.STOMP_TOPIC, json.stringify(o));
      res.status(200).json({status : 200});
    });
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
      var User = angoose.getClass('User');
      if(req.session.user) {
        // json = req.session.user;
        var query = User.findOne({openid: req.session.user.openid});
        query.exec(function(err, user) {
          if(user) {
            // update headimgurl
            user.headimgurl = req.session.user.headimgurl;
            // update session user object
            req.session.user = user;
            res.status(200).json(user);
          } else {
            res.status(200).json(req.session.user);
          }
        });
      } else { // for debug, use default user
        var query = User.findOne({openid: 'jlaijewojla92834lksjfl'});
        query.exec(function(err, user) {
          logger.info(user);
          if(user) {
            // update session user object
            req.session.user = user;
            res.status(200).json(user);
          } else {
            res.status(200).json(json);
          }
        });
      }
    },
    submitOrder: function(req, res) {
      // logger.info('session user: ', req.session.user);
      var u = req.session.user;
      // var u = {
      //   openid: 'jlaijewojla92834lksjfl',
      //   nickname: 'zjumper',
      //   sex: '1',
      //   province: 'Beijing',
      //   city: 'Beijing',
      //   country: 'China',
      //   headimgurl: '/img/user-icon.png',
      //   privilege: [],
      //   unionid: '',
      //   contact: []
      // };
      var order = req.body;
      // logger.info('order info -' + JSON.stringify(order));
      // save user information
      var User = angoose.getClass('User');
      var Order = angoose.getClass('Order');
      var query = User.findOne({openid: u.openid});
      query.exec(function(err, user) {
        if(user) {
          // logger.info(user);
          if(_.find(user.contact, function(c) {
            // logger.info(c);
            return c.mobile === order.contact.mobile
            && c.address === order.contact.address;
          }) === undefined) {
            user.contact.push(order.contact);
            logger.info('pushed');
          }
          user.headimgurl = u.headimgurl;
          // user.contact = u.contact;
          // logger.info('user info - ' + JSON.stringify(user));
          user.save((err) => {
            if(err) {
              logger.error(err);
              res.status(500).json({status : 500});
              return;
            }
            else logger.info('User info saved.');

            // save order
            saveOrder(Order, order, u, res);
          });
        } else { // new user
          var newUser = new User(u);
          if(newUser.contact)
            newUser.contact.push(order.contact);
          else {
            if(_.find(user.contact, function(c) {
              // logger.info(c);
              return c.mobile === order.contact.mobile
              && c.address === order.contact.address;
            }) === undefined) {
              user.contact.push(order.contact);
              logger.info('pushed');
            }
          }
          newUser.save((err) => {
            if(err) {
              logger.error(err);
              res.status(500).json({status : 500});
              return;
            }
            else logger.info('User info saved.');
            saveOrder(Order, order, u, res);
          });
        }
      });
    }
  };
})();
