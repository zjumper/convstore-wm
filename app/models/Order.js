var angoose = require("angoose"); /** if angoose is installed as module, then require('angoose')*/
var mongoose = angoose.getMongoose();
var orderSchema = new mongoose.Schema({
  orderid: {type: String, required: true},
  products: [{pid: String, name: String, price: Number, num: Number}],
  total: {num: Number, amount: Number},
  submittime: {type: String, required: true},
  contact: { openid:String, mobile: String, address: String}
});
module.exports = mongoose.model('Order', orderSchema);
