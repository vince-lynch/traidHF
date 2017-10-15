var express  = require('express'),
    router   = express.Router(),
    user     = require('../controllers/userController');
    //sendRaw  = require('../controllers/sendTokensToAccount');

router.get('/api', function(req,res){
  res.send('YES')
});

router.post('/api/newAccount', user.signupPost);
router.get('/api/login', user.loginPost);

router.post('/api/ipn', user.paymentRecieved);

//router.get('/api/buyCoins', sendRaw.sendCoins)

module.exports = router;