var fs = require('fs');

var AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;
var alphaVantageAPI = new AlphaVantageAPI('1LJ6MNDY8O41T56A', 'compact', true);

const AssetEvent = require('../models/assetEvent');
const StockData = require('../models/stockData');






getMarketData = function(symbol){

  console.log('vantageData');
  let lastHourData = [];

  alphaVantageAPI.getIntradayData(symbol, '1min')
  .then(intradayData => {
      console.log("Intraday data:");
      console.log(intradayData);

      saveMarketData(intradayData, symbol);
  })
  .catch(err => {
      console.error(err);
  });
}

// every half an hour get amazon data
setInterval(function(){
  getMarketData('AMZN')
},(1000 * 60) * 30) 

// every 32 minutes get Google data
setInterval(function(){
  getMarketData('GOOGL')
},(1000 * 60) * 32) 

// every half an hour get Telsa data
setInterval(function(){
  getMarketData('TSLA')
},(1000 * 60) * 35) 

// every 37 minutes get Apple data
setInterval(function(){
  getMarketData('AAPL')
},(1000 * 60) * 37) 

// every 39 minutes get Facebook data
setInterval(function(){
  getMarketData('FB')
},(1000 * 60) * 39) 





saveMarketData = function(minTicks, symbol){

  var totalTicks = [];

  var i = 0;
  for (i in minTicks) {
    tick = minTicks[i];

    totalTicks.push({
      high: tick.High,
      low: tick.Low,
      volume: tick.Volume,
      open: tick.Open,
      close: tick.Close,
      symbol: symbol,
      time: tick.Timestamp,
      unixtime: new Date(tick.Timestamp).valueOf(),
      uniqueId: symbol +  new Date(tick.Timestamp).valueOf()
    });
  }

  StockData.collection.insert(totalTicks, onInsert);

  function onInsert(err, docs) {
    if (err) {
        // TODO: handle error
        console.log('err', err)
    } else {
        console.info('%d totalStockDatas were successfully stored.', docs.length);
    }
  }
}




function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}

insertData = function(symbol){
  var tradeSymbol = symbol;

  readJSONFile('stock-historical/'+tradeSymbol+'201710191525-201710060930.json', function (err, json) {
    if(err) { throw err; }
    let histData = [];

    for (var key in json) {
      if (json.hasOwnProperty(key)) {
          histData.push({
            high: json[key]['2. high'],
            low: json[key]['3. low'],
            volume: json[key]['5. volume'],
            open: json[key]['1. open'],
            close: json[key]['4. close'],
            symbol: tradeSymbol,
            time: key,
            unixtime: new Date(key).valueOf(),
            uniqueId: tradeSymbol +  new Date(key).valueOf()
          });
      }
    }
    //console.log('histData', histData);

    StockData.collection.insert(histData, onInsert);

    function onInsert(err, docs) {
      if (err) {
          // TODO: handle error
          console.log('err', err)
      } else {
          console.info('%d totalStockDatas were successfully stored.', docs.length);
      }
    }

  });
}
//insertData('TLSA');


module.exports = {
	insertData: insertData,
	getMarketData: getMarketData
}