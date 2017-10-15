var Wallet = require('../models/Wallets');

const EthereumTx = require('ethereumjs-tx')
var Contract = require('truffle-contract')
var Web3 = require('web3')
var Transaction = require('ethereumjs-tx');
var Promise = require('bluebird')
var coder = require('web3/lib/solidity/coder');
var CryptoJS = require('crypto-js');

//Set Which Network you Want to Use
var theNetwork = "rinkeby" //rinkeby or mainnet

var testRegArtifact = require('./../contracts/'+theNetwork+'/Voting.json');

// Rinkeby Admin Account
var keypair = { "privateKey": "e92f12263af1bec6833ced6bc9b5ecc670a70bad662534329e79d41ec83f211b", "address": "0x0c1A5e96679d1C7D82888641D5F2Df88108CE349" }
//Rinkeby Test Wallet 2
// var keypair = {
// "address": "0xBE09830E9376Ed9474C64D952F62AfDC1f3Bc7Cc", 
// "privateKey": "df9acca444cf5541998bf01b7cb1a66a87e2a691e4111fda8fc44ef4597f99d8"
// }

var contractAddress;
var chainId;

var web3 = new Web3(new Web3.providers.HttpProvider("https://"+theNetwork+".infura.io/X3DitjB079q7GsMCtanI"));

var TestRegistry = Contract(testRegArtifact)
TestRegistry.setProvider(web3.currentProvider);
web3.eth = Promise.promisifyAll(web3.eth);

console.log('!!!keypair.privateKey', keypair.privateKey);
const privateKey = Buffer.from(keypair.privateKey, 'hex');


exports.sendCoins = function(_amountTo, _toAddress, theirEmail){
	var contractAddress = testRegArtifact.networks['4'].address;
		console.log('contractAddress', contractAddress);
		var chainId = 4;
		console.log('chainId', chainId);


		console.log('Your balance is, ', web3.eth.getBalance(keypair.address));
	//"Amz", 
		var data = '0x' + encodeFunctionTxData('admin', ['uint256', 'uint256', 'address'], [2, _amountTo, _toAddress])
		var theNonce = web3.eth.getTransactionCount(keypair.address);
		console.log('get nonce', theNonce)

		var estimateGas = web3.eth.estimateGas({
		    to: contractAddress, 
		    data: data 
		});
		var gasLimit = web3.eth.getBlock("latest").gasLimit;
		console.log('gas limit',web3.eth.getBlock("latest").gasLimit)

		var txParams = {
		  nonce: theNonce,
		  gasPrice: estimateGas.toString(), //estimateGas, // eth_estimateGas rpc result
		  gasLimit: (gasLimit / 2), //- 11111, //40000,//gasLimit.toString(), //'0x09184e72a000', // '' in decimal
		  to: contractAddress,
		  value: 0,
		  data: data, 
		  chainId: chainId
		}

		console.log('privateKey', privateKey);

		const tx = new EthereumTx(txParams)
		tx.sign(privateKey)
		const serializedTx = tx.serialize()


		web3.eth.sendRawTransaction('0x' +serializedTx.toString('hex'), function(err, hash) {
		  if (!err) {
		    console.log('some kind of success',hash);


			Wallet.findOne({email: theirEmail}, function(err, user) {
				if(user){
					user.initialFund.push({tx: hash, time: Date.now(), amount: _amountTo})
					user.save(function(err, doc){
						if(!err){
							console.log('added sendCoins transaction on user profile');
						}
					})
				}
			})

		  } else {
		    console.log('some kind of error',err); // [Error: invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type hexutil.Bytes]
		  }
		});

}


// WORKS!
// exports.sendCoins = function(){
// 	var contractAddress = testRegArtifact.networks['4'].address;
// 		console.log('contractAddress', contractAddress);
// 		var chainId = 4;
// 		console.log('chainId', chainId);


// 		console.log('Your balance is, ', web3.eth.getBalance(keypair.address));
// 	//"Amz", 
// 		var data = '0x' + encodeFunctionTxData('admin', ['uint256', 'uint256', 'address'], [2, 1400000000000000000, "0xBE09830E9376Ed9474C64D952F62AfDC1f3Bc7Cc"])
// 		var theNonce = web3.eth.getTransactionCount(keypair.address);
// 		console.log('get nonce', theNonce)

// 		var estimateGas = web3.eth.estimateGas({
// 		    to: contractAddress, 
// 		    data: data 
// 		});
// 		var gasLimit = web3.eth.getBlock("latest").gasLimit;
// 		console.log('gas limit',web3.eth.getBlock("latest").gasLimit)

// 		var txParams = {
// 		  nonce: theNonce,
// 		  gasPrice: estimateGas.toString(), //estimateGas, // eth_estimateGas rpc result
// 		  gasLimit: gasLimit - 11111, //40000,//gasLimit.toString(), //'0x09184e72a000', // '' in decimal
// 		  to: contractAddress,
// 		  value: 0,
// 		  data: data, 
// 		  chainId: chainId
// 		}

// 		console.log('privateKey', privateKey);

// 		const tx = new EthereumTx(txParams)
// 		tx.sign(privateKey)
// 		const serializedTx = tx.serialize()


// 		web3.eth.sendRawTransaction('0x' +serializedTx.toString('hex'), function(err, hash) {
// 		  if (!err) {
// 		    console.log('some kind of success',hash);
// 		  } else {
// 		    console.log('some kind of error',err); // [Error: invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type hexutil.Bytes]
// 		  }
// 		});

// }


//exports.sendCoins = function(){

	//web3.version.getNetwork((err, netId)=>{
	// 	var contractAddress = testRegArtifact.networks['4'].address;
	// 	console.log('contractAddress', contractAddress);
	// 	var chainId = 4;
	// 	console.log('chainId', chainId);


	// 	console.log('Your balance is, ', web3.eth.getBalance(keypair.address));
	// //"Amz", 
	// 	var data = '0x' + encodeFunctionTxData('holdAsset', ['string', 'uint256'], ['Amz', 55420000000])
	// 	var theNonce = web3.eth.getTransactionCount(keypair.address);
	// 	console.log('get nonce', theNonce)

	// 	var estimateGas = web3.eth.estimateGas({
	// 	    to: contractAddress, 
	// 	    data: data 
	// 	});
	// 	var gasLimit = web3.eth.getBlock("latest").gasLimit;
	// 	console.log('gas limit',web3.eth.getBlock("latest").gasLimit)

	// 	var txParams = {
	// 	  nonce: theNonce,
	// 	  gasPrice: estimateGas.toString(), //estimateGas, // eth_estimateGas rpc result
	// 	  gasLimit: gasLimit, //40000,//gasLimit.toString(), //'0x09184e72a000', // '' in decimal
	// 	  to: contractAddress,
	// 	  value: 0,
	// 	  data: data, 
	// 	  chainId: chainId
	// 	}

	// 	console.log('privateKey', privateKey);

	// 	const tx = new EthereumTx(txParams)
	// 	tx.sign(privateKey)
	// 	const serializedTx = tx.serialize()


	// 	web3.eth.sendRawTransaction('0x' +serializedTx.toString('hex'), function(err, hash) {
	// 	  if (!err) {
	// 	    console.log('some kind of success',hash);
	// 	  } else {
	// 	    console.log('some kind of error',err); // [Error: invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type hexutil.Bytes]
	// 	  }
	// 	});


	//})
	
//}










function encodeFunctionTxData(functionName, types, args) {
  var fullName = functionName + '(' + types.join() + ')';
  var signature = CryptoJS.SHA3(fullName, { outputLength: 256 }).toString(CryptoJS.enc.Hex).slice(0, 8);
  var dataHex = signature + coder.encodeParams(types, args);

  return dataHex;
}