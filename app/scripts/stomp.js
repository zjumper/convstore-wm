var Stomp = require('stomp-client'),
  config = require('./config');

var client = new Stomp(config.STOMP_HOST, config.STOMP_PORT, config.STOMP_USER, config.STOMP_PASSWD);

client.connect(function(sessionId) {
  console.log(sessionId);
  client.subscribe('/topic/order', function(body, headers) {
    console.log('from MQ:' + body);
  });
});
