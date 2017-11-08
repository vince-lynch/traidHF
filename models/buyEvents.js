var mongoose = require('mongoose');

var buyEventsSchema = new mongoose.Schema({
  transactionHash: { type: String, unique: true},
  stock: String,
  uniqueTranscId: Number,
  accountAddress: String,
  amount: String,
  _now: Number,
  processed: {}
});


var BuyEvents = mongoose.model('buyEvents', buyEventsSchema);

module.exports = BuyEvents;
