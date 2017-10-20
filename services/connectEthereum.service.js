var contract = require('truffle-contract');

//THE NETWORK
var theNetwork = "rinkeby" //rinkeby or mainnet
///
var Accounts = require('web3-eth-accounts');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("https://"+theNetwork+".infura.io/X3DitjB079q7GsMCtanI"));
var accounts = new Accounts(new Web3.providers.HttpProvider("https://"+theNetwork+".infura.io/X3DitjB079q7GsMCtanI"));
var abi = require('./../contracts/rinkeby/Voting.json').abi; // change to mainnet

var theContract = web3.eth.contract(abi);
var contractInstance = theContract.at('0x17ecbc8e84a6d78389b6b0677f0c5b8eb1ce30f0'); // Address of Rinkeby Contract - 0x17ecbc8e84a6d78389b6b0677f0c5b8eb1ce30f0

if(web3.isConnected())
   console.log(" web3 connected - ok");

//console.log('web3.version', web3.version);

web3.version.getNetwork((err, netId) => {
  switch (netId) {
    case "1":
      console.log('This is mainnet')
      break
    case "2":
      console.log('This is the deprecated Morden test network.')
      break
    case "3":
      console.log('This is the ropsten test network.')
      break
    default:
      console.log('This is an unknown network.')
  }
})

setTimeout(function(){
	console.log('//// MEANS CONNECTED TO THE CONTRACT///')
	console.log('The symbol', contractInstance.name.call());
	console.log('The symbol', contractInstance.symbol.call());
}, 5000)

module.exports = {
	contractInstance: contractInstance,
	theContract: theContract,
	web3: web3,
	accounts: accounts,
  abi: abi
}