var request = require('request');
var Web3EthAbi = require('web3-eth-abi');
var async = require('async');
var moment = require('moment');
var momentTz = require('moment-timezone');


var connectEthereum = require('../services/connectEthereum.service');
var { contractInstance, theContract, web3, accounts, abi, contractAddress } = connectEthereum;


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

              console.log('found EVENT', data);

            }
          }

      }
  })
}

checkBuyEventsOnTelsaContract(0, 'latest')



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