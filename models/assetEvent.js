var mongoose = require('mongoose');

var assetEventSchema = new mongoose.Schema({
  transactionHash: { type: String, unique: true},
  _buyer: String,
  _assetTkn: String,
  _BuyOrSell: String,
  _value: String,
  _now: String,
  tradeTransaction: {}
});


var AssetEvent = mongoose.model('AssetEvent', assetEventSchema);

module.exports = AssetEvent;
