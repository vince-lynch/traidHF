var mongoose = require('mongoose');

var walletSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true},
  password: String,
  walletAddress: String,
  walletKey: String,
  initialFund: []
});



var Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet
