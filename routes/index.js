var express  = require('express'),
    router   = express.Router(),
    stockList  = require('../services/stocksList'),
    user     = require('../controllers/userController'),
    events  = require('../controllers/eventsController'),
    access  = require('../controllers/userLookup'),
    market  = require('../controllers/marketData'),
    pNlCalc  = require('../controllers/profitLossCalculator');
    //sendRaw  = require('../controllers/sendTokensToAccount');


router.get('/api', function(req,res){
  res.send('YES')
});

router.post('/api/newAccount', user.signupPost);
router.get('/api/login', user.loginPost);


router.get('/api/allTrades/:buyer', access.tradesForUser);

router.get('/api/updateAssetTransaction', events.updateAssetsWithTransactions);


router.post('/api/ipn', user.paymentRecieved);
router.post('/api/access/walletAddressFromEmail', access.walletAddressFromEmail);

//router.get('/api/buyCoins', sendRaw.sendCoins)

module.exports = router;