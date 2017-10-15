process.on('unhandledRejection', console.log.bind(console))
var request = require('request');

var User = require('../models/User');
var Wallet = require('../models/Wallets');

//import { default as Web3} from 'web3';


var contract = require('truffle-contract');

//THE NETWORK
var theNetwork = "rinkeby" //rinkeby or mainnet
///
var Accounts = require('web3-eth-accounts');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("https://"+theNetwork+".infura.io/X3DitjB079q7GsMCtanI"));
var accounts = new Accounts(new Web3.providers.HttpProvider("https://"+theNetwork+".infura.io/X3DitjB079q7GsMCtanI"));
var abi = require('./../contracts/rinkeby/Voting.json').abi;

var theContract = web3.eth.contract(abi);
var contractInstance = theContract.at('0x17ecbc8e84a6d78389b6b0677f0c5b8eb1ce30f0'); // Address of Rinkeby Contract - 0x17ecbc8e84a6d78389b6b0677f0c5b8eb1ce30f0


//console.log('voting_artifacts', voting_artifacts)
//var TheContract = contract(voting_artifacts);

//console.log('theContract', theContract);


var sendRaw  = require('../controllers/sendTokensToAccount');

//var Accounts = require('web3-eth-accounts');


if(web3.isConnected())
   console.log(" web3 connected - ok");

console.log('web3.version', web3.version);
//window.accounts = new Accounts(new Web3.providers.HttpProvider("https://mainnet.infura.io/X3DitjB079q7GsMCtanI"));

// var api = require('etherscan-api').init('DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ');
// var balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
// balance.then(function(balanceData){
//   console.log(balanceData);
// });

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

// request('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ', function (error, response, body) {
//   if(!error){
//   	var currentDollarEthPrice = JSON.parse(body).result.ethusd;
//   	console.log('current eth dollar price:', currentDollarEthPrice);
//   }
// })


exports.paymentRecieved = function(req, res, next){
	console.log('paymentRecieved');
	console.log('req.body', req.body);

	// REMEMBER YOU CANT JUST ACCEPT THE POST REQUEST WITHOUT PROVING ITS FROM PAYPAL, ELSE YOU'll get robbed
	var paymentDetails = {email: req.body.payer_email, amount: req.body.mc_gross};

	//REMEMBER YOU NEED TO CALCULATE THE ETHEREUM AMOUNT FROM USD

	request('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ', function (error, response, body) {
	  if(!error){
	  	var currentDollarEthPrice = JSON.parse(body).result.ethusd;
	  	console.log('current eth dollar price:', currentDollarEthPrice);
	  	var theirInvestmentInEth = (paymentDetails.amount / currentDollarEthPrice);
	  	var theirInvestmentInWei = theirInvestmentInEth * 1000000000000000000;

	  	 signupViaPaypal(paymentDetails.email, theirInvestmentInWei); // make them a wallet using their paypal email
	  }
	})


}


  /**
   * POST /login
   * Sign in with email and password
   */
  exports.loginPost = function(req, res, next) {

  	console.log('req.query', req.query);

    Wallet.findOne({ email: req.query.email }, function(err, user) {
      if (!user) {
        return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
        'Double-check your email address and try again.'
        });
      } if(user){
      	//return res.status(200).send({ msg: 'The email address and password are correct', user: user})
      	return res.redirect('http://traidhf.vincelynch.com/#!/dashboard/' + user.walletAddress);
      }

    });
  };

/**
 * POST /signup
 */
exports.signupPost = function(req, res, next) {
	console.log('signupPost', req.body);

	var newAddress = accounts.create();
	console.log('accounts.create()', newAddress);

	//console.log('newAddress.privateKey',newAddress.privateKey);

	  Wallet.findOne({ email: req.body.email }, function(err, user) {
	    if (user) {
	    return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
	    }
	    console.log('reached here');
	    user = new Wallet({
	      email: req.body.email,
	      password: req.body.password,
	      walletAddress: newAddress.address,
	      walletKey: newAddress.privateKey,
	    });
	    user.save(function(err) {
		    sendRaw.sendCoins(1000000000000000000, newAddress.address, req.body.email);
		    res.send({user: user });
	    });
	  });
};


/**
 * Private // signupViaPaypal
 */
signupViaPaypal = function(email, amount) {
	console.log('signupViaPaypal, email', email, 'amount,', amount);

	var newAddress = accounts.create();
	console.log('accounts.create()', newAddress);

	//console.log('newAddress.privateKey',newAddress.privateKey);

	  Wallet.findOne({ email: email }, function(err, user) {
	    if (user) {
	    return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
	    }
	    console.log('reached here');
	    user = new Wallet({
	      email: email,
	      password: 'randomPassword',
	      walletAddress: newAddress.address,
	      walletKey: newAddress.privateKey,
	    });
	    user.save(function(err) {
		    sendRaw.sendCoins(amount, newAddress.address, email);
		    //res.send({user: user });
	    });
	  });
};