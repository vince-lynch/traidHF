var express  = require('express'),
    router   = express.Router(),
    stockList  = require('../services/stocksList'),
    user     = require('../controllers/userController'),
    //events  = require('../controllers/eventsController'),
    access  = require('../controllers/userLookup'),
    market  = require('../controllers/marketData'),
    transactForUser = require('../controllers/transactForUser'),
    pNlCalc  = require('../controllers/profitLossCalculator');
    //sendRaw  = require('../controllers/sendTokensToAccount');

var listenEvents  = require('../newContractsController/listenEvents');


router.get('/api', function(req,res){
  res.send('YES')
});

router.post('/api/newAccount', user.signupPost);
router.get('/api/login', user.loginPost);
router.post('/api/whoIsAddress', user.whoIsAddress);
router.post('/api/checkPassword', user.checkPassword);


router.post('/api/sellAssetFromPaypal', transactForUser.sellAsset);
router.post('/api/buyAssetFromPaypal', transactForUser.buyAsset);
//router.post('/api/withdrawFromPaypal' transactForUser.CAHtoEthereum)


router.get('/api/allTrades/:buyer', access.tradesForUser);
router.get('/api/stockHistory/:symbol', access.getStockHistoric);

//router.get('/api/updateAssetTransaction', events.updateAssetsWithTransactions);


router.post('/api/ipn', user.paymentRecieved);
router.post('/api/access/walletAddressFromEmail', access.walletAddressFromEmail);

//router.get('/api/buyCoins', sendRaw.sendCoins)

module.exports = router;