var angoose = require("angoose"); /** if angoose is installed as module, then require('angoose')*/
var mongoose = angoose.getMongoose();
var orderSchema = new mongoose.Schema({
  orderid: {type: String, required: true},
  products: [{pid: String, name: String, price: Number, num: Number}],
  total: {num: Number, amount: Number},
  submittime: {type: String, required: true},
  schedule: {type: String}, // schedule time for shipping
  contact: { openid:String, mobile: String, address: String},
  status: {type: Number}  //0-undeal, 1-confirmed, 2-sentout, 3-closed, -1-canceled
});
module.exports = mongoose.model('Order', orderSchema);
