//sendRawTransaction.js
// HOW TO SEND A RAW TRANSACTION
//https://github.com/ethereumjs/testrpc/issues/344
const EthereumTx = require('ethereumjs-tx')
var Contract = require('truffle-contract')
//var TestRPC = require('ethereumjs-testrpc');
var Web3 = require('web3')
var Transaction = require('ethereumjs-tx');
var Promise = require('bluebird')
var coder = require('web3/lib/solidity/coder');
var CryptoJS = require('crypto-js');

var testRegArtifact = require('./../contracts/rinkeby/Voting.json');
var keypair = { "privateKey": "e92f12263af1bec6833ced6bc9b5ecc670a70bad662534329e79d41ec83f211b",
                "address": "0x0c1A5e96679d1C7D82888641D5F2Df88108CE349" }

var theNetwork = "rinkeby" //rinkeby or mainnet
var web3 = new Web3(new Web3.providers.HttpProvider("https://"+theNetwork+".infura.io/X3DitjB079q7GsMCtanI"));

var TestRegistry = Contract(testRegArtifact)
TestRegistry.setProvider(web3.currentProvider);
web3.eth = Promise.promisifyAll(web3.eth)



const privateKey = Buffer.from('a86c269629ed2d15a1679da88538d12539c18645360c8dc7daf2cd2d8b4fcb1d', 'hex');




function encodeFunctionTxData(functionName, types, args) {
  var fullName = functionName + '(' + types.join() + ')';
  var signature = CryptoJS.SHA3(fullName, { outputLength: 256 }).toString(CryptoJS.enc.Hex).slice(0, 8);
  var dataHex = signature + coder.encodeParams(types, args);

  return dataHex;
}

var data = '0x' + encodeFunctionTxData('holdAsset', ['string', 'uint256'], ['Amz', 5000000000000000])

/// FOR DEPOSIT // WORKS!
// var data = '0x' + encodeFunctionTxData('deposit', [],[])
// var txParams = {
//   nonce: theNonce,
//   gasPrice: estimateGas.toString(), //estimateGas, // eth_estimateGas rpc result
//   gasLimit: 40000,//gasLimit.toString(), //'0x09184e72a000', // '' in decimal
//   to: "0x17ecbc8e84a6d78389b6b0677f0c5b8eb1ce30f0",
//   value: 10000000000000000,
//   data: data, //'0xb7aace390000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000012a05f2000000000000000000000000000000000000000000000000000000000000000003416d7a0000000000000000000000000000000000000000000000000000000000',
//   chainId: 4
// }
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



var theNonce = web3.eth.getTransactionCount('0x2beBB4586F24Af48d528fA85d2746C04DE0e399E');
console.log('get nonce', theNonce)

var estimateGas = web3.eth.estimateGas({
    to: "0x17ecbc8e84a6d78389b6b0677f0c5b8eb1ce30f0", 
    data: data //'0xb7aace390000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000012a05f2000000000000000000000000000000000000000000000000000000000000000003416d7a0000000000000000000000000000000000000000000000000000000000'
});
var gasLimit = web3.eth.getBlock("latest").gasLimit;
console.log('gas limit',web3.eth.getBlock("latest").gasLimit)

var txParams = {
  nonce: theNonce,
  gasPrice: estimateGas.toString(), //estimateGas, // eth_estimateGas rpc result
  gasLimit: gasLimit, //40000,//gasLimit.toString(), //'0x09184e72a000', // '' in decimal
  to: "0x17ecbc8e84a6d78389b6b0677f0c5b8eb1ce30f0",
  value: 0,
  data: data, //'0xb7aace390000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000012a05f2000000000000000000000000000000000000000000000000000000000000000003416d7a0000000000000000000000000000000000000000000000000000000000',
  chainId: 4
}




const tx = new EthereumTx(txParams)
tx.sign(privateKey)
const serializedTx = tx.serialize()


web3.eth.sendRawTransaction('0x' +serializedTx.toString('hex'), function(err, hash) {
  if (!err) {
    console.log('some kind of success',hash);
  } else {
    console.log('some kind of error',err); // [Error: invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type hexutil.Bytes]
  }
});



// var testNum = 1234
// var data = '0x' + encodeFunctionTxData('sellAsset', ['string'], ['Amz'],['uint256'], [2222222222])
// var testReg



// var theNonce = web3.eth.getTransactionCount('0x0c1A5e96679d1C7D82888641D5F2Df88108CE349');
// console.log('get nonce', theNonce)

// var Tx = require('ethereumjs-tx');
// var privateKey = new Buffer('e92f12263af1bec6833ced6bc9b5ecc670a70bad662534329e79d41ec83f211b', 'hex')

// var estimateGas = web3.eth.estimateGas({
//     to: "0x17ecbc8e84a6d78389b6b0677f0c5b8eb1ce30f0", 
//     data: data
// });
// console.log('estimateGas', estimateGas);
// var gasLimit = web3.eth.getBlock("latest").gasLimit;
// console.log('gas limit',web3.eth.getBlock("latest").gasLimit)

// var rawTx = {
//   nonce: theNonce,
//   gasPrice: estimateGas, //estimateGas, // eth_estimateGas rpc result
//   gasLimit: gasLimit, //'0x09184e72a000', // 21,000 in decimal
//   to: "0x17ecbc8e84a6d78389b6b0677f0c5b8eb1ce30f0",
//   value: '0x0000',
//   data: '0xb7aace390000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000012a05f2000000000000000000000000000000000000000000000000000000000000000003416d7a0000000000000000000000000000000000000000000000000000000000',
//   chainId: 4
// }

// var tx = new Tx(rawTx);
// tx.sign(privateKey);

// var serializedTx = tx.serialize();

// web3.eth.sendRawTransaction('0x' +serializedTx.toString('hex'), function(err, hash) {
//   if (!err) {
//     console.log('some kind of success',hash);
//   } else {
//     console.log('some kind of error',err); // [Error: invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type hexutil.Bytes]
//   }
// });

// here!

//Rinkeby Test Wallet 1
//0x0c1A5e96679d1C7D82888641D5F2Df88108CE349
// PRIVATE KEY
//  e92f12263af1bec6833ced6bc9b5ecc670a70bad662534329e79d41ec83f211b

//var accounts = Object.keys(provider.manager.state.accounts)
//var txParams = {from: '0x0c1A5e96679d1C7D82888641D5F2Df88108CE349', gas: 2000000}




//const privateKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')

// const txParams = {
//   nonce: '0x00',
//   gasPrice: '0x09184e72a000', 
//   gasLimit: '0x2710',
//   to: '0x0000000000000000000000000000000000000000',
//   from: '0x0c1A5e96679d1C7D82888641D5F2Df88108CE349',
//   value: '0x00', 
//   data: data,
//   // EIP 155 chainId - mainnet: 1, ropsten: 3
//   chainId: 4
// }


//console.log(serializedTx.toString('hex')); // f86180825208825208948005ceb675d2ff8c989cc95354438b9fab56868101801ca096e0cb2e633f07a7ee1f761dba1109c18a44550692305c03c72403ffa0b8fc12a012482fd916fa0a05396fadbf13b39619193e9f80dd5a0fd32086257cc3a11796



// const tx = new EthereumTx(txParams)
// tx.sign(privateKey)
// const serializedTx = tx.serialize().toString('hex')

// web3.eth.sendRawTransactionAsync(serializedTx).then(txHash => {
//   return web3.eth.getTransactionReceiptAsync(txHash)
// }).then(tx => {
//   console.log('Gas used: ' + tx.gasUsed)
// })

// console.log('got this far');

// TestRegistry.new(txParams).then(instance => {
//   testReg = instance
//   return testReg.sellAsset.call(keypair.address)
// }).then(registeredNum => {
//   console.log('Registered number before tx: ' + registeredNum.toNumber())
//   return web3.eth.getBalanceAsync(keypair.address)
// }).then(bal => {
//   console.log('Balance before tx: ', bal.toNumber())
//   return web3.eth.getTransactionCountAsync(keypair.address)
// }).then(nonce => {
//   var tx = new Transaction({
//     to: testReg.address,
//     value: 0,
//     nonce: nonce,
//     data: data,
//     gasLimit: 2000000
//   })
//   tx.sign(Buffer.from('e92f12263af1bec6833ced6bc9b5ecc670a70bad662534329e79d41ec83f211b', 'hex'))
//   //var signedRawTx = tx.serialize().toString('hex')

//   var serializedTx = tx.serialize();

//   return web3.eth.sendRawTransactionAsync('0x' + serializedTx.toString('hex'))
// }).then(txHash => {
//   return web3.eth.getTransactionReceiptAsync(txHash)
// }).then(tx => {
//   console.log('Gas used: ' + tx.gasUsed)
//   return testReg.registry.call(keypair.address)
// }).then(registeredNum => {
//   console.log('Registered number after tx: ' + registeredNum.toNumber())
//   return web3.eth.getBalanceAsync(keypair.address)
// }).then(bal => {
//   console.log('Balance after tx: ', bal.toNumber())
// })

