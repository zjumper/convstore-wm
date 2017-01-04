var fs = require('fs'),
  angoose = require("angoose"); /** if angoose is installed as module, then require('angoose')*/
  // Product = require('../models/Product');

// var mongoose = angoose.getMongoose();
angoose.init(null, {
  'module-dirs':'./app/models',
  'logging':'TRACE',
  'mongo-opts': 'localhost:27017/convstore'
});
var Product = angoose('Product');
var data = fs.readFileSync('products.csv', {encoding: 'utf-8'});
var lines = data.split('\n');
for(var i = 0; i < lines.length; i ++) {
  var fields = lines[i].split(',');
  if(fields.length < 4) {
    console.log('skip lien: ', lines[i]);
    continue;
  }
  var p = new Product({});
  p.id = i;
  p.qcode = fields[0];
  p.name = fields[1];
  p.price = fields[2];
  p.subcat = fields[3];
  p.category = fields[3].substring(0,2);
  p.unit = '件';
  p.pcode = 'N/A';
  p.stock = 1;
  p.pic = 'default.png';
  p.save((err, prod) => {
    if(err)
      console.log(err);
    else {
      console.log('product ', prod.qcode, ' saved');
    }
  });
}
