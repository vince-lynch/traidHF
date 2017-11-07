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
const privateKey = Buffer.from(keypair.privateKey, 'hex');

var contractAddress;
var chainId;

var web3 = new Web3(new Web3.providers.HttpProvider("https://"+theNetwork+".infura.io/X3DitjB079q7GsMCtanI"));

var TestRegistry = Contract(testRegArtifact)
TestRegistry.setProvider(web3.currentProvider);
web3.eth = Promise.promisifyAll(web3.eth);



var confirmLegitimate = function(address, password){
	return Wallet.findOne({ walletAddress: address, password: password })
}

///
////
/// SENDS MONEY FROM ADMIN ACCOUNT (contract) TO ANY ETHEREUM ACCOUNT (HIGH RISK). 
////
///
var CAHtoEthereum = function(_toAddress,  _amountTo){
	var data = '0x' + encodeFunctionTxData('admin', ['uint256', 'uint256', 'address'], [1, _amountTo, _toAddress]);
	var address = address;
	var privateKey = Buffer.from(keypair.privateKey, 'hex'); // We'll pay for them to remove their funds!
	rawTransaction(data, keypair.address, privateKey);
}

setTimeout(function(){
	//CAHtoEthereum('0x5bAE5B4e8B592Ba6Bf97bE25cA483C745244f319', '20000000');
}, 4500)



var sellAsset = function(req, res, next){
	confirmLegitimate(req.body.address, req.body.password).exec((err, user)=>{
		if(user){
			var data = '0x' + encodeFunctionTxData('sellAsset', ['string', 'uint256'], [req.body.symbol, req.body.amount])
			var address = req.body.address;
			var privateKey = Buffer.from(user.walletKey.split('0x')[1], 'hex');
			rawTransaction(data, address, privateKey);
		}
	})
}

var buyAsset = function(req, res, next){
	console.log('BUYASSET - req.body', req.body)
	confirmLegitimate(req.body.address, req.body.password).exec((err, user)=>{
		if(user){

			console.log('amount', parseInt(req.body.amount));

			var data = '0x' + encodeFunctionTxData('holdAsset', ['string', 'uint256'], ['AMZN', parseInt(req.body.amount)])
			var address = req.body.address;
			var privateKey = Buffer.from(user.walletKey.split('0x')[1], 'hex'); // We'll pay for them to remove their funds!
			rawTransaction(data, req.body.address, privateKey);

			// var data = '0x' + encodeFunctionTxData('holdAsset', ['string', 'uint256'], [req.body.symbol, req.body.amount.toString()])
			// var address = req.body.address;
			// console.log('user.walletKey', user.walletKey);
			// var privateKey = Buffer.from(user.walletKey.split('0x')[1], 'hex');
			// console.log('THIS IS PRIVATEKEY', user.walletKey.split('0x')[1])
			// rawTransaction(data, address, privateKey);
		}
	})
}

var buyAssetWithAccount = function(_amount){
	var data = '0x' + encodeFunctionTxData('holdAsset', ['string', 'uint256'], ['AMZN', _amount])
	var address = '0x5bAE5B4e8B592Ba6Bf97bE25cA483C745244f319';
	var privateKey = Buffer.from(keypair.privateKey, 'hex'); // We'll pay for them to remove their funds!
	rawTransaction(data, keypair.address, privateKey);
}
setTimeout(()=>{
	//buyAssetWithAccount(262212)
	//CAHtoEthereum('0x5bAE5B4e8B592Ba6Bf97bE25cA483C745244f319', '20000000000000');
}, 2000)


// compiles ABI with Args into HEX
function encodeFunctionTxData(functionName, types, args) {
  var fullName = functionName + '(' + types.join() + ')';
  var signature = CryptoJS.SHA3(fullName, { outputLength: 256 }).toString(CryptoJS.enc.Hex).slice(0, 8);
  var dataHex = signature + coder.encodeParams(types, args);

  return dataHex;
}


var rawTransaction = function(data, address, privateKey){
	console.log('privateKey', privateKey);

	var contractAddress = testRegArtifact.networks['4'].address;

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

	console.log('balance:', web3.eth.getBalance(keypair.address).toString())
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


module.exports = {
  buyAsset: buyAsset,
  sellAsset: sellAsset,
  CAHtoEthereum: CAHtoEthereum
}



//////
/// FOR buyAsset // WORKS!!!!
/////
// var data = '0x' + encodeFunctionTxData('holdAsset', ['string', 'uint256'], ['Amz', 5000000000000000])
// var txParams = {
//   nonce: theNonce,
//   gasPrice: estimateGas.toString(), //estimateGas, // eth_estimateGas rpc result
//   gasLimit: gasLimit, //40000,//gasLimit.toString(), //'0x09184e72a000', // '' in decimal
//   to: "0x17ecbc8e84a6d78389b6b0677f0c5b8eb1ce30f0",
//   value: 0,
//   data: data, //'0xb7aace390000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000012a05f2000000000000000000000000000000000000000000000000000000000000000003416d7a0000000000000000000000000000000000000000000000000000000000',
//   chainId: 4
// }
///////