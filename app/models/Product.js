var angoose = require("angoose"); /** if angoose is installed as module, then require('angoose')*/
var mongoose = angoose.getMongoose();
var productSchema = new mongoose.Schema({
  id: {type: String, required: true},
  name: { type: String, required: true, tags:['default-list'], label:'Name'},
  price: { type: Number, required: true, tags:['default-list'], label:'Price'},
  unit: { type: String, required: true, label:'Unit'},
  stock: { type: Number, required: true, tags:['default-list'], label:'Stock'},
  pcode: { type: String, required: true, label:'EAN'},
  qcode: { type: String, required: true, label:'Bar Code'},
  pic: {type: String, required: true, label: 'Picture'},
  desc: { type:String}
});
module.exports = mongoose.model('Product', productSchema);
