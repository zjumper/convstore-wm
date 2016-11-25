var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  log4js = require('log4js'),
  api = require('./scripts/api');

log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'logs/log.log',
      maxLogSize: 1024,
      backups:3,
      category: 'normal'
    }
  ]
});

var app = express();

app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser.json());
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {level:log4js.levels.DEBUG}));

logger.info('Server initializing ...');

app.get('/api/getProductList', api.getProductList);
// app.get('/api/getConfList', api.getConfList);
// app.get('/api/getConfContent', api.getConfContent);
// app.post('/api/saveConfContent', api.saveConfContent);
// app.get('/api/testConfFile', api.testConfFile);

app.listen(8080);
