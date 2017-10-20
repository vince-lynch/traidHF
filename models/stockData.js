var mongoose = require('mongoose');

var stockDataSchema = new mongoose.Schema({
  uniqueId: { type: String, unique: true},
  high: Number,
  low: Number,
  volume: Number,
  open: Number,
  close: Number,
  symbol: String,
  time: Date,
  unixtime: Number
});


var StockData = mongoose.model('stockData', stockDataSchema);

module.exports = StockData;
