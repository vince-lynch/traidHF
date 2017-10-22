import { default as Web3} from 'web3';
const web3 = new Web3(window.web3.currentProvider);

console.log('Welcome to Cryptoah');

import { default as contract } from 'truffle-contract'

var cryptoah_rinkeby = require('../../build/contracts/rinkeby/Voting.json');
var cryptoah = require('../../build/contracts/Voting.json');

var subDomain = window.location.host.split('.')[0];
if(subDomain == "test"){ // check if we are wanting to use testnetwork
 var cryptoah = cryptoah_rinkeby;
}
var Cryptoah = contract(cryptoah);


Cryptoah.setProvider(web3.currentProvider);
window.Cryptoah = Cryptoah;


web3.version.getNetwork((err, netId) => {
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

console.log('you are using -', web3.eth.accounts[0]);




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

import headerNav from './components/header.js';
import footerBar from './components/footer.js';
import startToday from './components/start-today.js';
import paypalPayment from './components/payment.js';

// SERVICES
import BasicService from './services/basicService';

//FACTORIES
import injectCSS from './services/cssFactory';



var app = angular.module("myApp", ['ngRoute', 'angularMoment'])
  .controller('dashboardCtrl', dashboardCtrl)
  .controller('hoverbarController', hoverbarController)
  .controller('assetsCtrl', assetsCtrl)
  .controller('homepageController', homepageController)
  .controller('TransactionsCtrl', TransactionsCtrl)
  .controller('walletCtrl', walletCtrl)
  .controller('testPaymentCtrl', testPaymentCtrl)
  .controller('accessViaEmailController', accessViaEmailController)

  .service('BasicService', BasicService)
  .factory('injectCSS', injectCSS)

  .component('mortgageForm', mortgageForm)
  .component('paperDashboard', paperDashboard)
  .component('assetTrades', assetTrades)
  .component('headerNav', headerNav)
  .component('footerBar', footerBar)
  .component('startToday', startToday)
  .component('paypalPayment', paypalPayment)
  .component('dashboardOverview', dashboardOverview)



.config(function($routeProvider, $locationProvider) {
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
      // .when('/dashboard/:address', {
      //   templateUrl: 'partials/dashboard/main.html',
      //   controller: 'dashboardCtrl'
      // })
      .when('/dashboard/trades',{
        template: `<asset-trades></asset-trades>`
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




