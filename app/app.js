var express = require('express'),
  session = require('express-session'),
  path = require('path'),
  bodyParser = require('body-parser'),
  log4js = require('log4js'),
  angoose = require('angoose'),
  api = require('./scripts/api'),
  cb = require('./scripts/callback'),
  config = require('./scripts/config');

log4js.configure({
  appenders: [
    { type: 'console', //控制台输出
      category: 'normal'
    },
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

app.use(express.static('app'));
app.use(session({secret: '20161220'}));
app.use(bodyParser.json());
// app.use(express.cookieParser());
// app.use(express.session({secret: '1234567890QWERTY'}));
var logger = log4js.getLogger('normal');
logger.setLevel('DEBUG');
app.use(log4js.connectLogger(logger, {level:log4js.levels.DEBUG}));

logger.info('Server initializing ...');
app.get('/wx', cb.wx);
app.get('/api/getProductList', api.getProductList);
app.get('/api/getUserInfo', api.getUserInfo);
app.get('/callback/auth', cb.auth);
// app.get('/api/getConfList', api.getConfList);
// app.get('/api/getConfContent', api.getConfContent);
// app.post('/api/saveConfContent', api.saveConfContent);
// app.get('/api/testConfFile', api.testConfFile);

angoose.init(app, {
  'module-dirs':'./app/models',
  'logging':'TRACE',
  'mongo-opts': 'localhost:27017/convstore'
});

setInterval(api.getWxToken, 7200000);
api.getWxToken();

app.listen(8080);
