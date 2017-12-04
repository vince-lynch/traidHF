var mongoose = require('mongoose');

var sellEventsSchema = new mongoose.Schema({
  transactionHash: { type: String, unique: true},
  stock: String,
  uniqueTranscId: Number,
  accountAddress: String,
  amount: String,
  _now: Number,
  processed: {}
});


var SellEvents = mongoose.model('sellEvents', sellEventsSchema);

module.exports = SellEvents;
