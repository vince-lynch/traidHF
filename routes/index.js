var express  = require('express'),
    router   = express.Router(),
    user     = require('../controllers/userController'),
    events  = require('../controllers/eventsController'),
    access  = require('../controllers/userLookup'),
    market  = require('../controllers/marketData');
    //sendRaw  = require('../controllers/sendTokensToAccount');

router.get('/api', function(req,res){
  res.send('YES')
});

router.post('/api/newAccount', user.signupPost);
router.get('/api/login', user.loginPost);

router.get('/api/assettransactions', events.getAssetTransactions);
router.get('/api/updateAssetTransaction', events.updateAssetsWithTransactions);

//router.get('/api/vantage', market.updateMarketData)


router.post('/api/ipn', user.paymentRecieved);
router.post('/api/access/walletAddressFromEmail', access.walletAddressFromEmail);

//router.get('/api/buyCoins', sendRaw.sendCoins)

module.exports = router;