var mongoose = require('mongoose');

var assetEventSchema = new mongoose.Schema({
  transactionHash: { type: String, unique: true},
  _buyer: String,
  _assetTkn: String,
  _BuyOrSell: String,
  _amount: Number,
  _now: String,
  _USD_EQUIV: Number,
  _SUM: Number,
  _ledger: Number,
  tradeTransaction: {}
});


var AssetEvent = mongoose.model('AssetEvent', assetEventSchema);

module.exports = AssetEvent;
