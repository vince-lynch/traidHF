var fs = require('fs');
var async = require('async');
var request = require('request');
var DateWithOffset = require('date-with-offset');

var AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;
var alphaVantageAPI = new AlphaVantageAPI('1LJ6MNDY8O41T56A', 'compact', true);

const AssetEvent = require('../models/assetEvent');
const StockData = require('../models/stockData');

var nowOnServer = new DateWithOffset(-60);
var today = new Date();
console.log('Date right now', nowOnServer)



getVantageData = function(symbol){
  var endpoint = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+ symbol +'&interval=1min&apikey=1LJ6MNDY8O41T56A&outputsize=compact'

  request(endpoint, function (error, response, body) {
      if(error) console.log('couldnt get vantageData', error);
      if(!error){
        var body = JSON.parse(body);
        var lastHourData = body["Time Series (1min)"];
        //console.log('got data', data);
        saveMarketData2(lastHourData, symbol);
      }
  })
}
//getVantageData('AMZN');




var saveMarketData2 = function(ticks, symbol){

  async.each(Object.keys(ticks), function (key, callback) {
    let tick = ticks[key]
    //console.log('async each', tick)
    var stockData = new StockData({
      high: tick['2. high'],
      low: tick['3. low'],
      volume: tick['5. volume'],
      open: tick['1. open'],
      close: tick['4. close'],
      symbol: symbol,
      time: new Date(key),
      unixtime: new Date(key).valueOf(),
      uniqueId: symbol +  new Date(key).valueOf()
    });

    stockData.save(function(err, item){
      if (err){
        console.log(err);
      }
      console.log('Saved', item);
    });
  })


}


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
  async.each(minTicks, function (tick, callback) {
    var stockData = new StockData({
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

    stockData.save(function(err, item){
      if (err){
        console.log(err);
      }
      console.log('Saved', item);
    });
  })
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



module.exports = {
	insertData: insertData,
	getMarketData: getMarketData
}