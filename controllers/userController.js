process.on('unhandledRejection', console.log.bind(console))
var request = require('request');

var User = require('../models/User');
var Wallet = require('../models/Wallets');
var sendRaw  = require('../controllers/sendTokensToAccount');

var connectEthereum = require('../services/connectEthereum.service');
var { contractInstance, theContract, web3, accounts } = connectEthereum;





//window.accounts = new Accounts(new Web3.providers.HttpProvider("https://mainnet.infura.io/X3DitjB079q7GsMCtanI"));

// var api = require('etherscan-api').init('DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ');
// var balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
// balance.then(function(balanceData){
//   console.log(balanceData);
// });



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
	    	// SHOULD TOP-UP Funds of the account
	    	sendRaw.sendCoins(amount, newAddress.address, email);
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