var request = require('request');
var Web3EthAbi = require('web3-eth-abi');
var async = require('async');

var connectEthereum = require('../services/connectEthereum.service');
var { contractInstance, theContract, web3, accounts, abi, contractAddress } = connectEthereum;

const market  = require('./marketData');
const pNlCalc = require('./profitLossCalculator');

const AssetEvent = require('../models/assetEvent');
const StockData = require('../models/stockData');

var currentDollarEthPrice = 0;




/** Checks Ethereum USD price
// every ten minutes
**/
var checkEthPrice = function(){
  setInterval(function(){
    request('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ', function (error, response, body) {
      if(!error){
        currentDollarEthPrice = JSON.parse(body).result.ethusd;
      }
    })
  }, (1000 * 60) * 10) 
}
checkEthPrice();


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

        getAssetTransactions(0, 'latest') // get transactions for last 50 blocks
        blocksAgo = blockNumber;
      }
      //console.log('blockNumber', blockNumber)
    })
  }, 1000 * secs)
}
checkNewBlocksForTransactions(60, 3, 50);



/**
 CONVERTS WeiIntoUSD 
 (Used to calculate how much of the stock the user can afford)
 (helps to update how many shares they own)
**/
var weiToUSD = function(weiAmount){
  var weiInEth = weiAmount / 1000000000000000000;

  console.log('current eth dollar price:', currentDollarEthPrice);
  var usdAmount = (weiInEth * currentDollarEthPrice);

  return usdAmount.toFixed(2);
}

/**
  LOOKS IN OUR HISTORICAL RECORD OF STOCK PRICES 
  TO MATCH THE CLOSEST (NEXT) PRICE OF THE ASSET THE USER TRIED TO BUY
**/
var findNearestPriceToTime = function(symbol, transactionTime){
   // Depends if we saved in unixtime millaseconds or seconds
  transactionTime = parseInt(transactionTime); //* 1000;
  return StockData.find({}).where('unixtime').gt(transactionTime).sort({"unixtime":1}).limit(1)
}

/**
 CHECKS OUR HISTORICAL STOCK DATA OR PROMPTS OUR SYSTEM TO VISIT THE NYSE
 UPDATES THE ASSET-TRANSACTION-DB WITH THE AMOUNT OF SHARES BOUGHT
 AND UPDATES THE SUM OF THE SHARES * PRICE PAID FOR THOSE SHARES
 THEN UPDATES THE USERS LEDGER WITH THE ACCOUNTING OF THEIR RECORDS TO CALCULATE
 PROFIT AND LOSS FOR THE TRANSACTIONS SO FAR.
**/
var updateAssetsWithTransactions = function(){
  AssetEvent.find({}).stream()
     .on('data', function(doc){

        /**
         Checks we have the Historical Stock Information, match nearest time to blockchain transaction
        **/
        findNearestPriceToTime(doc._assetTkn, doc._now).exec((err,trade)=>{
          
          // maybe we don't have the marketData so
          // might not have found the trade (yet)
          if(trade.length != 0){ 

            /**
            Only add TRADE transaction for assetEvents we haven't processed
            Bare in mind the price of USD only makes sense for the moment the transaction
            is processed (even though the stock price is historical, or present)
            **/
            if(!doc.hasOwnProperty('tradeTransaction')){
              var usdEquiv = weiToUSD(doc._amount);

              doc.set('tradeTransaction', {
                id   : trade[0]._id,
                close: trade[0].close,
                time : trade[0].time,
                _usd : usdEquiv,
                shares: usdEquiv / trade[0].close, // shares bought
                _SUM: (usdEquiv / trade[0].close) * usdEquiv // SUM is amount of shares * price.
              });

              doc.save(function(err){
                if(!err){
                  pNlCalc.updateUserLedger(doc._buyer, doc._assetTkn)
                }
              });
            }
            
          } else {
          /**
            Get the PRICE OF THE ASSET from New York Stock Exchange
          **/
            market.areMarketsOpen(doc._assetTkn, doc._now); // get the Market Data then retry;
          }

        });
  })
  .on('error', function(error) {
      //throw error;
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
    //console.log('getAssetTransactions calling rinkeby endpoint');
    var apiAddress = "https://rinkeby.etherscan.io/api?module=logs&action=getLogs&fromBlock="+ blockFrom +"&toBlock="+ blockTo +"&address="+ contractAddress +"&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ"
  } else {
    var apiAddress = 'https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock='+ blockFrom +'&toBlock='+ blockTo +'&address='+ contractAddress +'&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ';
  }

  request(apiAddress, function (error, response, body) {
        if(!error){
          var body = JSON.parse(body);
          var events = body.result;

          var totalAssetTransactions = [];
          var TXsList = [];

          //console.log('processing ', events.length, ' transactions');
          
          var i = 0;
          for(i in events){
            if(events[i].topics.length == 2){
              //console.log('events[i].topics', events[i].topics);
                
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

              //console.log('data', data);

              let transactionHash = events[i].transactionHash;
              let { _buyer, _assetTkn, _BuyOrSell, _value, _now } = data;
              _assetTkn = _assetTkn.replace(/[^a-zA-Z ]/g, ""); // remove any weird characters from astTokez
              totalAssetTransactions.push({transactionHash, _buyer, _assetTkn, _BuyOrSell, _value, _now})

              TXsList.push(transactionHash); // we will use these to update the ledger for each of these
            }
          }
          //console.log('totalAssetTransactions', totalAssetTransactions)
          /**
           ADD EACH ASSET TRANSACTION TO THE DATABASE
          **/
          async.each(totalAssetTransactions, function (theEvent, callback) {
            var assetEvent = new AssetEvent({
              transactionHash: theEvent.transactionHash,
              _buyer: theEvent._buyer,
              _assetTkn: theEvent._assetTkn,
              _BuyOrSell: theEvent._BuyOrSell,
              _amount: theEvent._value,
              _now: theEvent._now
            });

            assetEvent.save(function(err, item){
              if (err){
                //console.log(err);
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
