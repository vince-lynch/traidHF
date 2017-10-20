var request = require('request');
var Web3EthAbi = require('web3-eth-abi');
var async = require('async');

var connectEthereum = require('../services/connectEthereum.service');
var { contractInstance, theContract, web3, accounts, abi, contractAddress } = connectEthereum;

const market  = require('./marketData');

const AssetEvent = require('../models/assetEvent');
const StockData = require('../models/stockData');



/**
Everytime a new block look for transactions
// if everyNumBlocks blocks has passed then check for new transactions
**/
var checkNewBlocksForTransactions = function(secs, everyNumBlocks, fetchLastNthBlocks){
  var blocksAgo = 0;

  setInterval(function(){
    web3.eth.getBlockNumber((error, blockNumber)=>{
      
      if((blockNumber - everyNumBlocks) > blocksAgo){
        console.log(blockNumber, blocksAgo)

        let last50 = blockNumber - fetchLastNthBlocks;

        getAssetTransactions(last50, blockNumber) // get transactions for last 50 blocks
        blocksAgo = blockNumber;
      }
      console.log('blockNumber', blockNumber)
    })
  }, 1000 * secs)
}
checkNewBlocksForTransactions(2, 3, 2000)





var findNearestPriceToTime = function(symbol, transactionTime){
  transactionTime = parseInt(transactionTime) * 1000;
  return StockData.find({}).where('unixtime').gt(transactionTime).sort({"unixtime":1}).limit(1)
}

var updateAssetsWithTransactions = function(){
  AssetEvent.find({}).stream()
     .on('data', function(doc){
        findNearestPriceToTime('AMZN', doc._now).exec((err,trade)=>{
          // maybe we don't have the marketData so
          if(trade.length != 0){ // might not have found the trade (yet)
            doc.set('tradeTransaction', {
              id   : trade[0]._id,
              close: trade[0].close,
              time : trade[0].time
            });
          } else {
            //market.getMarketData('AMZN') // get the Market Data then retry;
          }
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


getAssetTransactions = function(blockFrom, blockTo) {
  //blockFrom = getAll == true ? 0 : blockFrom
  //blockFrom = blockFrom - 50 // get last 50 blocks
  //console.log('connectEthereum.whichNetwork', connectEthereum);
  var whichNetwork = 'rinkeby';

  if(whichNetwork == 'rinkeby'){
    console.log('getAssetTransactions calling rinkeby endpoint');
    var apiAddress = "https://rinkeby.etherscan.io/api?module=logs&action=getLogs&fromBlock="+ blockFrom +"&toBlock="+ blockTo +"&address="+ contractAddress +"&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ"
  } else {
    var apiAddress = 'https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock='+ blockFrom +'&toBlock='+ blockTo +'&address='+ contractAddress +'&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ';
  }

  request(apiAddress, function (error, response, body) {
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
          //console.log('totalAssetTransactions', totalAssetTransactions);


          async.each(totalAssetTransactions, function (theEvent, callback) {
            var assetEvent = new AssetEvent({
              transactionHash: theEvent.transactionHash,
              _buyer: theEvent._buyer,
              _assetTkn: theEvent._assetTkn,
              _BuyOrSell: theEvent._BuyOrSell,
              value: theEvent.value,
              _now: theEvent._now
            });

            assetEvent.save(function(err, item){
              if (err){
                console.log(err);
              }
              console.log('Saved', item);
            });
          })
          updateAssetsWithTransactions();// find the stock price for these.

      }
  })
}



module.exports = {
  getAssetTransactions: getAssetTransactions,
  updateAssetsWithTransactions: updateAssetsWithTransactions
}