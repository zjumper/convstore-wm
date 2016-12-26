var angoose = require("angoose"); /** if angoose is installed as module, then require('angoose')*/
var mongoose = angoose.getMongoose();
var userSchema = new mongoose.Schema({
  openid: {type: String, required: true},
  nickname: { type: String, required: true, tags:['default-list'], label:'Name'},
  sex: { type: String, required: true, tags:['default-list'], label:'Sex'},
  province: { type: String, required: true, label:'Province'},
  city: { type: String, required: true, tags:['default-list'], label:'City'},
  country: { type: String, required: true, label:'Country'},
  headimgurl: { type: String, required: true, label:'Head Image'},
  privilege: {type: [String], required: false, label: 'Privilege'},
  unionid: { type:String},
  contact: [{ mobile: String, address: String}]
});
module.exports = mongoose.model('User', userSchema);
