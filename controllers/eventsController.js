var request = require('request');
var Web3EthAbi = require('web3-eth-abi');
var yahooFinance = require('yahoo-finance');

var AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;
var alphaVantageAPI = new AlphaVantageAPI('1LJ6MNDY8O41T56A', 'compact', true);

var connectEthereum = require('../services/connectEthereum.service');
var { contractInstance, theContract, web3, accounts, abi } = connectEthereum;

const AssetEvent = require('../models/assetEvent');
const StockData = require('../models/stockData');


var findNearestPriceToTime = function(symbol, transactionTime){
  transactionTime = parseInt(transactionTime) * 1000;
  return StockData.find({}).where('unixtime').gt(transactionTime).sort({"unixtime":1}).limit(1)
}

exports.updateAssetsWithTransactions = function(req,res,next){
  AssetEvent.find({}).stream()
     .on('data', function(doc){
        findNearestPriceToTime('AMZN', doc._now).exec((err,trade)=>{
          doc.set('tradeTransaction', {
            id   : trade[0]._id,
            close: trade[0].close,
            time : trade[0].time
          });
          doc.save(function(err){
          });
        });
  })
  .on('error', function(error) {
      throw error;
  })
  .on('end', function() {
      // final callback
  });
}




exports.getAssetTransactions = function(req, res, next) {
  request('https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0x9652EFE6b07416fa0d024BA02ad4DCb319485325&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ', function (error, response, body) {
        if(!error){
          var body = JSON.parse(body);
          var events = body.result;

          var totalAssetTransactions = [];
          
          var i = 0;
          for(i in events){
            if(events[i].topics.length > 1){
                
              let data = Web3EthAbi.decodeLog([
              {
                "indexed": true,
                "name": "_buyer",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "_assetTkn",
                "type": "string"
              },
              {
                "indexed": false,
                "name": "_BuyOrSell",
                "type": "string"
              },
              {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "_now",
                "type": "uint256"
              }],
                  events[i].data,//'0x000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000038d7ea4c680000000000000000000000000000000000000000000000000000000000059d9533c000000000000000000000000000000000000000000000000000000000000000522416d7a2200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034255590000000000000000000000000000000000000000000000000000000000',
                  events[i].topics
              );

              let transactionHash = events[i].transactionHash;
              let { _buyer, _assetTkn, _BuyOrSell, _value, _now } = data;
              _assetTkn = _assetTkn.replace(/[^a-zA-Z ]/g, ""); // remove any weird characters from astTokez


              totalAssetTransactions.push({transactionHash, _buyer, _assetTkn, _BuyOrSell, _value, _now})
            }
          }
          console.log('totalAssetTransactions', totalAssetTransactions);
          
          //https://stackoverflow.com/questions/16726330/mongoose-mongodb-batch-insert
          AssetEvent.collection.insert(totalAssetTransactions, onInsert);

          function onInsert(err, docs) {
            if (err) {
                // TODO: handle error
                console.log('err', err)
            } else {
                console.info('%d assetTransactions were successfully stored.', docs);
            }
          }
      }
  })
}
