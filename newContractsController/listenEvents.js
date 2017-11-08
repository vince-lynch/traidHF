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


var connectEthereum = require('../services/connectEthereum.service');
var { contractInstance, theContract, web3, accounts, abi, contractAddress } = connectEthereum;


var Xray = require('x-ray');
var x = Xray();

var buyEvents =  require('../models/buyEvents');

var encodeFunctionTxData = function(functionName, types, args) {
	console.log('inside encodeFunctionTxData', functionName, types, args );
  var fullName = functionName + '(' + types.join() + ')';
  var signature = CryptoJS.SHA3(fullName, { outputLength: 256 }).toString(CryptoJS.enc.Hex).slice(0, 8);
  var dataHex = signature + coder.encodeParams(types, args);
  console.log('worked out dataHex', dataHex);
  return dataHex;
}
/**
Everytime a new block look for transactions
// if everyNumBlocks blocks has passed then check for new transactions
**/
// var checkNewBlocksForTransactions = function(secs, everyNumBlocks, fetchLastNthBlocks){
//   var blocksAgo = 0;

//   setInterval(function(){
//     web3.eth.getBlockNumber((error, blockNumber)=>{
      
//       if((blockNumber - everyNumBlocks) > blocksAgo){
//         //console.log(blockNumber, blocksAgo)

//         let last50 = blockNumber - fetchLastNthBlocks;

//         getAssetTransactions(0, 'latest') // get transactions for last 50 blocks
//         blocksAgo = blockNumber;
//       }
//       //console.log('blockNumber', blockNumber)
//     })
//   }, 1000 * secs)
// }
// checkNewBlocksForTransactions(6, 3, 50);


//WORKING ONLY ON THE TELSA CONTRACT ATM
//https://rinkeby.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0x5b4ED4E823925A45890Ed32Fe4F046B1f78B5aE1&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ

// Step 1, get BUY event

// Step 1) Listen for the events (COMPLETED) - see controller, api example - https://rinkeby.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0x5b4ED4E823925A45890Ed32Fe4F046B1f78B5aE1&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ
// Step 2) Store in database new events
// Step 3) work out percentage of share for new event
// Step 4) send back percentage of share result to contract.


checkBuyEventsOnTelsaContract = function(blockFrom, blockTo) {

	var totalBuyEvents = [];

  var whichNetwork = 'rinkeby';

  if(whichNetwork == 'rinkeby'){
    var apiAddress = "https://rinkeby.etherscan.io/api?module=logs&action=getLogs&fromBlock="+ blockFrom +"&toBlock="+ blockTo +"&address="+ '0x5b4ED4E823925A45890Ed32Fe4F046B1f78B5aE1' + "&topic0=0xeb4842919dfee08196c63843d459282f4351b255a17619c0a6b0977ee8c76086"  + "&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ"
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


						  buyEvents.create(theObj, function (err, saved) {
						    if (err){

						    } else { // means NEW Transaction
						    	console.log('saved', saved);
					        console.log('saved for ', transactionHash)
						    	approveBuyShare(transactionHash, theObj)
						    }
						  })


              //TXsList.push(transactionHash); // we will use these to update the ledger for each of these

            }
          }

          console.log('totalBuyEvents', totalBuyEvents);

      }
  })
}



var approveBuyShare = function(transactionHash, tObj){
	console.log('called approveBuyShare', tObj);

	var _addr = tObj.accountAddress;

  //////////////////////////// ?????? /////////////////////////////
	// CALCULATE THE PERCENTAGE WORTH OF THE SHARE THEY ARE BUYING //
	/////////////////////////////////////////////////////////////////

	/**  When buy
		145.71500 / 1123.65 = 0.129680061 (then into WEI) 129680061000000000 
	**/

  // Step 1: Take WEI amount bought and work out how many parts of an ETH they own?.
  var ethParts = tObj.amount / 1000000000000000000;

  // Step 2: Work out dollar equivelent for their ETH
	var checkEthPrice = function(cb){
	  request('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ', function (error, response, body) {
	    if(!error){
	      cb(JSON.parse(body).result.ethusd)
	    }
	  })
	}
	checkEthPrice((ethUSD)=>{
		console.log('ethUSD', ethUSD);

		// Step 3: Work out the US Dollar value of the parts of Eth they own
		var theirUSD = ethUSD * ethParts;

		// Step 4: Get the current share price for the Share in Question.
		scrapeData((err, sharePrice)=>{
			console.log('sharePrice', sharePrice)

		// Step 5: Divide their Dollar amount by the Price of a Share of the asset
			var partsOfShare = theirUSD / sharePrice;
			//console.log('partsOfShare', partsOfShare)

		// Step 6: Convert PartsOfShare into WEI number
			var partsOfShareInWei = 1000000000000000000 * partsOfShare;


    /////////////////////////////////////////////////////////////////////
    ////////// APPROVE THEIR STOCK PURCHASE //////////////////////////////
    ///////////////////////////////////////////////////////////////////////
		// Step 7: Update Contract approveBuyShare function with this number for their transaction.


	  // {
	  //   "name": "_percentageOfShareInWei",
	  //   "type": "uint256"
	  // },
	  // {
	  //   "name": "_utid",
	  //   "type": "uint256"
	  // },
	  // {
	  //   "name": "_addr",
	  //   "type": "address"
	  // }

		  var keypair = { "privateKey": "e92f12263af1bec6833ced6bc9b5ecc670a70bad662534329e79d41ec83f211b",
	                "address": "0x0c1A5e96679d1C7D82888641D5F2Df88108CE349" }

	    console.log('just before compiling data')

			var data = '0x' + encodeFunctionTxData('approveBuyShare', ['uint256', 'uint256', 'address'], [partsOfShareInWei.toString(), parseInt(tObj.uniqueTranscId), _addr ])
			//var data = '0x' + encodeFunctionTxData('admin', ['uint256', 'uint256', 'address'], [1, '33344343443', _addr]);

			console.log('got data hash ready to send', data);

			var privateKey = Buffer.from(keypair.privateKey, 'hex');

			console.log('About to call RAWTransaction to approveBuyShare')
			rawTransaction(data, keypair.address, privateKey);

		})



	});

}

var rawTransaction = function(data, address, privateKey){
	console.log('privateKey', privateKey);

  /// TESLA CONTRACT // RINKEBY NETWORK
	var contractAddress = '0x5b4ED4E823925A45890Ed32Fe4F046B1f78B5aE1';

	console.log('contractAddress', contractAddress);
	console.log('still here1')

	var chainId = 4;
	console.log('stillhere2', address)

	var theNonce = web3.eth.getTransactionCount(address);

	console.log('got nonce');

	var estimateGas = web3.eth.estimateGas({
	    to: contractAddress, 
	    data: data 
	});

	console.log('hello here');

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

	console.log('txParams', txParams);

	var gasCalc = txParams.gasLimit * txParams.gasPrice + txParams.value;
	console.log('calc', gasCalc, 'typeof:', typeof gasCalc);

	const tx = new EthereumTx(txParams);

	tx.sign(privateKey)
	const serializedTx = tx.serialize();

	console.log('got this far');


	web3.eth.sendRawTransaction('0x' +serializedTx.toString('hex'), function(err, hash) {
	  if (!err) {
	    console.log('some kind of success',hash);
	  } else {
	    console.log('some kind of error',err); // [Error: invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type hexutil.Bytes]
	  }
	});

}



checkBuyEventsOnTelsaContract(0, 'latest')





function scrapeData (cb) {
	x('https://www.investing.com/equities/tesla-motors', {
	  main: 'title',
	  price: '#last_last'
	})((err, obj) => {
		//console.log('obj', obj.price);
		cb(err, obj.price)
	})
}

// scrapeData((err, sharePrice)=>{
// 	console.log('err', err)
// 	console.log('sharePrice', sharePrice)
// })



/// Now We need to Write Code to Approve the BUY request on the telsa contract///


/**

 WORK OUT BUY SHARE AMOUNT LOGIC TO SEND BACK

	 ON BUY  - We get their buy event emitted from the contract on the blockchain.
	--------------
	Amazon share price; $1,122.29
	Ethereum Price: 291.89

	1 Eth is 0.260084292 Amazon Shares
	Split into wei parts = 260084292000000000;
	Update contract with that amount
**/