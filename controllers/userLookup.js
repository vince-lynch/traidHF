var User = require('../models/User');
var Wallet = require('../models/Wallets');


 exports.walletAddressFromEmail = function(req, res, next) {

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
