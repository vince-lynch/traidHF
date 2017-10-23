var fs = require('fs');
var async = require('async');
var request = require('request');
var moment = require('moment');
var momentTz = require('moment-timezone');
var momentBusinessTime = require('moment-business-time');

var AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;
var alphaVantageAPI = new AlphaVantageAPI('1LJ6MNDY8O41T56A', 'compact', true);

const stockList  = require('../services/stocksList');
const AssetEvent = require('../models/assetEvent');
const StockData = require('../models/stockData');




var saveMarketData2 = function(ticks, symbol){

  console.log('ticks', ticks, symbol);

  var theData = [];

  for (var key in ticks) {
    let tick = ticks[key]
    //console.log('async each', tick)
    var stockObj = {
      high: tick['2. high'],
      low: tick['3. low'],
      volume: tick['5. volume'],
      open: tick['1. open'],
      close: tick['4. close'],
      symbol: symbol, // TODO: The 3600 is a temp fix (NYC time was wrong by an hour)
      time: moment.unix((parseInt(moment(key).unix()) +  parseInt(3600))).format(),
      unixtime: (parseInt(moment(key).unix()) +  parseInt(3600)), // TODO: THIS IS A TEMP FIX, NYC TIME WAS BEHIND BY AN HOUR??
      uniqueId: symbol +  (parseInt(moment(key).unix()) + parseInt(3600)) // this is a temp fix
    };

    theData.push(stockObj);

    StockData.update({uniqueId: stockObj.uniqueId}, stockObj, {upsert: true}).exec(function(err, saved){
      if(err){
        console.log(err.message, 'problem saving for ', symbol)
      }
      if(!err){
        console.log('saved for ', symbol)
      }
    })
  }


}



//getVantageData('AMZN');

var getVantageData = function(symbol){

// If Stock Isn't on Exchange then Don't bother querying it.
  if(stockList.isListed(symbol) == false){
    return null;
  }

  let apikeys = [
    'M3RMS0SKRGCGAM22',
    //'1LJ6MNDY8O41T56A',
    'Q5AVO9T23G56DB65',
    'NXE3QM7XO602JEQZ',
    'F62GTDYS3S24CJE9',
    'O8FNKEBNUPK9ZL4X'
  ]

  var apikey = apikeys[Math.floor(Math.random()*apikeys.length)];


  var endpoint = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+ symbol +'&interval=1min&apikey='+ apikey +'&outputsize=compact';

  request(endpoint, function (error, response, body) {
      if(error) console.log('couldnt get vantageData', error);
      if(!error){
        var fullbody = body;
        var body = JSON.parse(body);
        var lastHourData = body["Time Series (1min)"];
       
        //console.log('got body', fullbody);

        saveMarketData2(lastHourData, symbol);
      }
  })
}



/**
  The New York Stock Exchange (NYSE) is open Monday through Friday, 9:30 a.m. to 4:00 p.m. EST
  (Excluding  public holidays)
  //23-nov, 25-dec, 1-jan, 15-jan, 19-feb, 30-march, 28 may, 04 july, 03 sept, 22 nov, 
**/

momentBusinessTime.defineLocale('NYSE',{
  workinghours: {
      0: null,
      1: ['09:30:00', '16:00:00'],
      2: ['09:30:00', '16:00:00'],
      3: ['09:30:00', '16:00:00'],
      4: ['09:30:00', '16:00:00'],
      5: ['09:30:00', '16:00:00'],
      6: null
  },
    holidays: [
      '2017-11-23', 
      '2017-12-25',
      '2018-01-01',
      '2018-01-15',
      '2018-02-19',
      '2018-03-30',
      '2018-04-28',
      '2018-07-04'
  ]
});
/**
TIME ZONE, if you ever run into timezone problems again
run this command on the server - sudo dpkg-reconfigure tzdata 
**/
var areMarketsOpen = function(symbol, unixTime){

  var nycTime = moment(unixTime * 1000).tz("America/New_York");
  var theOffset = nycTime._offset * 60;
  var offetUnix = parseInt(unixTime) + parseInt(theOffset); 
  //var transactionTime = moment.unix(unixTime).format();
  //var newYork = momentTz.tz(transactionTime, "America/New_York");

  if(momentBusinessTime(nycTime).isWorkingTime() == true){

    //console.log('REACHED THIS FAR WITH ', symbol, newYork)
    // if markets are open
    // then look for prices for asset customer has bought.
    getVantageData(symbol);
     //console.log("STOP HERE", theOffset)


  } else {
    console.log('NYSE closed at', momentBusinessTime(nycTime).lastWorkingTime())
    console.log('Please wait until, NYSE opens next', momentBusinessTime(nycTime).nextWorkingTime())
  }
}


// every half an hour get amazon data
setInterval(function(){
  areMarketsOpen('AMZN', moment().unix());
},(1000 * 60) * 40) 

// every 32 minutes get Google data
setInterval(function(){
  areMarketsOpen('GOOGL', moment().unix());
},(1000 * 60) * 32) 

// every half an hour get Telsa data
setInterval(function(){
  areMarketsOpen('TSLA', moment().unix()); // call telsa function now
},(1000 * 60) * 29) 

// every 37 minutes get Apple data
setInterval(function(){
  areMarketsOpen('AAPL', moment().unix());
},(1000 * 60) * 37) 

// every 39 minutes get Facebook data
setInterval(function(){
  areMarketsOpen('FB', moment().unix());
},(1000 * 60) * 39) 






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
            time: moment().format(key),
            unixtime: moment(key).unix(),
            uniqueId: tradeSymbol +  moment(key).unix()
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
//insertData('APPL');


module.exports = {
	insertData: insertData,
  areMarketsOpen: areMarketsOpen
}