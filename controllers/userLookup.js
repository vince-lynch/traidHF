const AssetEvent = require('../models/assetEvent');
var User = require('../models/User');
var Wallet = require('../models/Wallets');


var walletAddressFromEmail = function(req, res, next) {

	console.log('walletAddressFromEmail - req.body', req.body);

  Wallet.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      return res.status(401).json({ msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
      'Double-check your email address and try again.'
      });
    } if(user){
    	return res.json({ redirectAdd: user.walletAddress });
    }

  });
};


var tradesForUser = function(req, res, next){

  AssetEvent.find({ _buyer: req.params.buyer }, function(err, trades) {
    if (!trades) {
      return res.status(401).json({ msg: 'Could not find any trades with that wallet ' + req.params.buyer + ' if your trade is within the last 2 minutes, please wait, otherwise...'});
    } if(trades){
      return res.json({ trades: trades, numTrades: trades.length });
    }

  });
}


module.exports = {
  walletAddressFromEmail: walletAddressFromEmail,
  tradesForUser: tradesForUser
}
