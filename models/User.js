var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true},
  password: String,
  walletAddress: String,
  walletKey: String
});



var User = mongoose.model('User', userSchema);

module.exports = User;
