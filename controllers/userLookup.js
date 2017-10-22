const AssetEvent = require('../models/assetEvent');
var User = require('../models/User');
var Wallet = require('../models/Wallets');
const StockData = require('../models/stockData');


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
  console.log('req.params.buyer', req.params.buyer.toLowerCase())
  AssetEvent.find({ _buyer: req.params.buyer.toLowerCase() }, function(err, trades) {
    if (!trades) {
      return res.status(401).json({ msg: 'Could not find any trades with that wallet ' + req.params.buyer + ' if your trade is within the last 2 minutes, please wait, otherwise...'});
    } if(trades){
      return res.json({ trades: trades, numTrades: trades.length });
    }

  });
}


var getStockHistoric = function(req, res, next){

  StockData.find({ symbol: req.params.symbol }).sort({unixtime: 1}).exec(function(err, data) {
    if (!data) {
      return res.status(401).json({ msg: 'Could not find any data for that symbol ' + req.params.symbol});
    } if(data){
      return res.json({ data: data, symbol: req.params.symbol });
    }

  });
}


module.exports = {
  walletAddressFromEmail: walletAddressFromEmail,
  tradesForUser: tradesForUser,
  getStockHistoric: getStockHistoric
}
