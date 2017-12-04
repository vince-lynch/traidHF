
//////////////////////////////////////////////////////////////
///// DETECTS PENDING SELLS AND THEN AUTHORISES THEM //////
////////////////////////////////////////////////////////////

// MODULES ////
var request = require('request');
var Web3EthAbi = require('web3-eth-abi');
var async = require('async');
var moment = require('moment');
var momentTz = require('moment-timezone');

const EthereumTx = require('ethereumjs-tx')
var Contract = require('truffle-contract')
var Web3 = require('web3')
var Transaction = require('ethereumjs-tx');
var Promise = require('bluebird')
var coder = require('web3/lib/solidity/coder');
var CryptoJS = require('crypto-js');

// collection to store sell events
var sellEvents =  require('../models/sellEvents');

// Needed for scraping current stock price
var Xray = require('x-ray');
var x = Xray();

// Ethereum Connect to Node /// 
var connectEthereum = require('../services/connectEthereum.service');
var { contractInstance, theContract, web3, accounts, abi, contractAddress } = connectEthereum;

//
/// TESLA CONTRACT // RINKEBY NETWORK
var contractAddress = '0x5b4ED4E823925A45890Ed32Fe4F046B1f78B5aE1';
var chainId = 4;

// Private Keys
var keypair = { 
								"privateKey": "e92f12263af1bec6833ced6bc9b5ecc670a70bad662534329e79d41ec83f211b",
	              "address": "0x0c1A5e96679d1C7D82888641D5F2Df88108CE349" 
	            }


// Function to encode data hash
var encodeFunctionTxData = function(functionName, types, args) {
  var fullName = functionName + '(' + types.join() + ')';
  var signature = CryptoJS.SHA3(fullName, { outputLength: 256 }).toString(CryptoJS.enc.Hex).slice(0, 8);
  var dataHex = signature + coder.encodeParams(types, args);
  return dataHex;
}

// Step 7: Update Contract approveSellShare function with this [partsOfShareInWei] number for their transaction.
var getTransactionReady = function(partsOfShareInWei, uniqueTranscId, address, sellEventId) {
	var data = '0x' + encodeFunctionTxData('approveSellShare', ['uint256', 'uint256', 'address'], 
	[partsOfShareInWei.toString(), parseInt(uniqueTranscId), address ])
	var privateKey = Buffer.from(keypair.privateKey, 'hex');

	sendApproveTransaction(data, keypair.address, privateKey, sellEventId);
}

// Function to find current eth price
var getEthDollarPrice = function(){
	return new Promise((resolve, reject) => {
	  request('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ', function (error, response, body) {
	    if(!error){
	      resolve(JSON.parse(body).result.ethusd)
	    }
	  })
	})
}

var scrapeData = function(cb) {
	x('https://www.investing.com/equities/tesla-motors', {
	  main: 'title',
	  price: '#last_last'
	})((err, obj) => {
		//console.log('obj', obj.price);
		cb(err, obj.price)
	})
}


// Listen for SELL Event on Tesla contract

checkSellEventsOnTeslaContract = function(blockFrom, blockTo) {

	var totalSellEvents = [];

  var whichNetwork = 'rinkeby';

  if(whichNetwork == 'rinkeby'){
  	//https://rinkeby.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0x5b4ED4E823925A45890Ed32Fe4F046B1f78B5aE1&topic0=0x4c66ee9ad8f19c5252b3f86fb32d1d6a30d0a745e89dc74aca80ff5742f0d1bf&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ
    var apiAddress = "https://rinkeby.etherscan.io/api?module=logs&action=getLogs&fromBlock="+ blockFrom +"&toBlock="+ blockTo +"&address="+ contractAddress + "&topic0=0x4c66ee9ad8f19c5252b3f86fb32d1d6a30d0a745e89dc74aca80ff5742f0d1bf"  + "&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ"
  } 

  request(apiAddress, function (error, response, body) {
        if(!error){
          var body = JSON.parse(body);
          var events = body.result;

          var totalAssetTransactions = [];
          var TXsList = [];

          var i = 0;
          for(i in events){
            if(events[i].topics.length == 1){
                
              let data = Web3EthAbi.decodeLog([
				        {
				          "indexed": false,
				          "name": "uniqueTranscId",
				          "type": "uint256"
				        },
				        {
				          "indexed": false,
				          "name": "accountAddress",
				          "type": "address"
				        },
				        {
				          "indexed": false,
				          "name": "amount",
				          "type": "uint256"
				        },
				        {
				          "indexed": false,
				          "name": "_now",
				          "type": "uint256"
				        }
				      ],
                  events[i].data,//'0x000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000038d7ea4c680000000000000000000000000000000000000000000000000000000000059d9533c000000000000000000000000000000000000000000000000000000000000000522416d7a2200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034255590000000000000000000000000000000000000000000000000000000000',
                  events[i].topics
              );

              let transactionHash = events[i].transactionHash;
						  let { uniqueTranscId, accountAddress, amount, _now } = data;

						  accountAddress = Web3EthAbi.decodeParameter('address', accountAddress).toLowerCase();

						  var theObj = {
						  	stock: 'Tesla',
						  	transactionHash,
						  	uniqueTranscId,
						  	accountAddress,
						  	amount,
						  	_now,
						  	processed: {hasProcessed: false} 
						  };


						  sellEvents.create(theObj, function (err, saved) {
						    if (err){

						    } else { // means NEW Transaction
						    	console.log('saved', saved);
					        console.log('saved for ', transactionHash)
						    	//approveBuyShare(transactionHash, theObj)
						    }
						  })
              //TXsList.push(transactionHash); // we will use these to update the ledger for each of these
            }
          }

          console.log('totalSellEvents', totalSellEvents);
      }
  })
}

//checkSellEventsOnTeslaContract(0, 'latest');

findUnprocessedSellEvents = function() {
	sellEvents.find({
    'processed': {hasProcessed: false}
	}).stream()
	   .on('data', function(doc){
		   /** if unprocessed document found, then
		       find the price for that document and send that to the contract
		       to approve the sell
		   **/
		   approveSellShare({
		   	  _id: doc._id,
			   	transactionHash: doc.transactionHash,
			  	uniqueTranscId: doc.uniqueTranscId,
			  	amount: doc.amount,
			  	accountAddress: doc.accountAddress
			  })

	})
	.on('error', function(error) {
	    throw error;
	})
	.on('end', function() {
	    // final callback
	});
}




//////////////////////////// /////// /////////////////////////////
// CALCULATE THE PERCENTAGE WORTH OF THE SHARE THEY ARE SELLING //
/////////////////////////////////////////////////////////////////
var approveSellShare = function(tObj){
	const { accountAddress, amount, uniqueTranscId, transactionHash, _id } = tObj;
	const sellEventId = _id;

  // Work out the US Dollar value of the parts of Eth they own
	getEthDollarPrice().then((ethUSD)=> {
		console.log('ethUSD', ethUSD);
		var ethParts = amount / 1000000000000000000;
		var theirUSD = ethUSD * ethParts;

		// Step 4: Get the current share price for the Share in Question.
		scrapeData((err, sharePrice)=>{
			console.log('sharePrice', sharePrice);
			// Step 5: Divide their Dollar amount by the Price of a Share of the asset
			var partsOfShare = theirUSD / sharePrice;
			// Step 6: Convert PartsOfShare into WEI number
			var partsOfShareInWei = 1000000000000000000 * partsOfShare;
			// Call step 7:
			getTransactionReady(partsOfShareInWei, uniqueTranscId, accountAddress, sellEventId);
		})
	})
	.catch((err) => {
		console.log('something went wrong: ', err);
	});

}

findUnprocessedSellEvents();




var sendApproveTransaction = function(data, address, privateKey, sellEventId){
	var theNonce = web3.eth.getTransactionCount(address);
	var estimateGas = web3.eth.estimateGas({
	    to: contractAddress, 
	    data: data 
	});
	var gasLimit = web3.eth.getBlock("latest").gasLimit;

	var txParams = {
	  nonce: theNonce ,
	  gasPrice: estimateGas.toString(), //estimateGas, // eth_estimateGas rpc result
	  gasLimit: Math.floor(gasLimit / 2), //- 11111, //40000,//gasLimit.toString(), //'0x09184e72a000', // '' in decimal
	  to: contractAddress,
	  value: 0,
	  data: data, 
	  chainId: chainId
	}

	var gasCalc = txParams.gasLimit * txParams.gasPrice + txParams.value;
	const tx = new EthereumTx(txParams);
	tx.sign(privateKey)
	const serializedTx = tx.serialize();
	
	web3.eth.sendRawTransaction('0x' +serializedTx.toString('hex'), function(err, hash) {
	  if (!err) {
	    console.log('some kind of success',hash);
	    // Save the Success on the sellEvent.processed.hasProcessed: true
	    // save the tx on sellEvent.processed.tx = 
	    sellEvents.findOne({_id: sellEventId}, function(err, event) {
				if(event){
					event.processed = {
						hasProcessed: true,
						tx: hash
					}
					event.save(function(err, event){
						if(!err){
							console.log('Tesla sellEvent approved');
						}
					})
				}
			})

	  } else {
	    console.log('some kind of error', err); // [Error: invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type hexutil.Bytes]
	  }
	});

}

