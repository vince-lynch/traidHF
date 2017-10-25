import { default as Web3} from 'web3';


var subDomain = window.location.host.split('.')[0];


import { default as contract } from 'truffle-contract'

var cryptoah_rinkeby = require('../../build/contracts/rinkeby/Voting.json');
var cryptoah = require('../../build/contracts/Voting.json');

if(subDomain == "test"){ // check if we are wanting to use testnetwork
 var cryptoah = cryptoah_rinkeby;
}
var Cryptoah = contract(cryptoah);




// CONTROLLERS
import dashboardCtrl from './controllers/dashboard.js';
import hoverbarController from './controllers/hoverbar.js';
import assetsCtrl from './controllers/assets.js';
import homepageController from './controllers/homepage.js';
import TransactionsCtrl from  './controllers/transactions.js';
import walletCtrl from  './controllers/wallet.js';
import testPaymentCtrl from  './controllers/testPaymentCtrl.js';
import accessViaEmailController from './controllers/findWalletbyId';


// COMPONENTS
import mortgageForm from './components/mortgage.js';

import paperDashboard from './components/dashboard.js';
import dashboardOverview from './components/dashboard/overview.js';
import assetTrades from './components/dashboard/trades.js';
import wallet from './components/dashboard/wallet.js';
import chatHelper from './components/dashboard/chathelper.js';

import headerNav from './components/header.js';
import footerBar from './components/footer.js';
import startToday from './components/start-today.js';
import paypalPayment from './components/payment.js';


// SERVICES
import BasicService from './services/basicService';
import BalanceService from './services/balancesService';

//FACTORIES
import injectCSS from './services/cssFactory';

var app = angular.module("myApp", ['ngRoute', 'angularMoment', 'ngAnimate', 'ngOdometer']);
app.controller('dashboardCtrl', dashboardCtrl)
  app.controller('hoverbarController', hoverbarController)
  app.controller('assetsCtrl', assetsCtrl)
  app.controller('homepageController', homepageController)
  app.controller('TransactionsCtrl', TransactionsCtrl)
  app.controller('walletCtrl', walletCtrl)
  app.controller('testPaymentCtrl', testPaymentCtrl)
  app.controller('accessViaEmailController', accessViaEmailController)


  app.service('BalanceService', BalanceService)
  app.service('BasicService', BasicService)
  app.factory('injectCSS', injectCSS)

  app.component('mortgageForm', mortgageForm)
  app.component('paperDashboard', paperDashboard)
  app.component('assetTrades', assetTrades)
  app.component('headerNav', headerNav)
  app.component('footerBar', footerBar)
  app.component('startToday', startToday)
  app.component('paypalPayment', paypalPayment)
  app.component('dashboardOverview', dashboardOverview)
  app.component('wallet', wallet)
  app.component('chatHelper', chatHelper)
  app.config(function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(false);

      $routeProvider
        .when('/', {
          template: `
            <header-nav></header-nav>
            <mortgage-form></mortgage-form>
            <footer-bar></footer-bar>
          `
        })     
        .when('/start-today', {
          template: `
            <header-nav ></header-nav>
            <start-today></start-today>
            <footer-bar></footer-bar>
          `
        })
        .when('/dashboard',{
          template: `<paper-dashboard></paper-dashboard>`
          //templateUrl: 'partials/dashboard/main.html',
          //controller: 'dashboardCtrl'
        })
        .when('/dashboard/:address', {
          template: `<paper-dashboard></paper-dashboard>`
        })
        .when('/payment', {
          template: `
            <header-nav ></header-nav>
            <paypal-payment></paypal-payment>
            <footer-bar></footer-bar>
          `
        })
        .when('/access/email', {
          templateUrl: 'partials/findwalletbyemail.html',
          controller: 'accessViaEmailController'
        })
        .otherwise({
          templateUrl: 'partials/404.html'
        });
  });



/**
// CONNECT TO METAMASK OR infura node
**/
window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
    window.whichProvider = 'metamask';
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    if(subDomain == "test"){ // check if we are wanting to use testnetwork
      console.log('using infura rinkeby');
      window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/X3DitjB079q7GsMCtanI"));
    
      window.whichProvider = 'api';
    } else { // use mainnet
      console.log('using infura mainnet');
      window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/X3DitjB079q7GsMCtanI"));

      window.whichProvider = 'api';
    }
  }

  // Now you can start your app & access web3 freely:
  var checkWeb3 = setInterval(function(){
    if(window.web3 !== undefined){
      clearInterval(checkWeb3);
      startApp();
    }
  }, 500)
})

var startApp = function(){
  console.log('Welcome to Cryptoah');

  Cryptoah.setProvider(window.web3.currentProvider);
  window.Cryptoah = Cryptoah;



  window.web3.version.getNetwork((err, netId) => {
    switch (netId) {
      case "1":
        console.log('This is mainnet')
        break
      case "4":
        console.log('This is the rinkeby test network.')
        break
      default:
        console.log('This is an unknown network.')
    }
  })

  console.log('you are using -', window.web3.eth.accounts[0]);

  /**
    Only start Angular After we have connected to Infura
    // Note: for metamask we can make this instant
  **/
  angular.element(function() {
    angular.bootstrap(document, ['myApp']);
  });
}













  




