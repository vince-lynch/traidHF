// Import libraries we need.
import { default as Web3} from 'web3';
var Accounts = require('web3-eth-accounts');

import { default as contract } from 'truffle-contract'


var voting_artifactsRinkeby = require('../../build/contracts/rinkeby/Voting.json');
var voting_artifacts = require('../../build/contracts/Voting.json');

var subDomain = window.location.host.split('.')[0];
if(subDomain == "test"){ // check if we are wanting to use testnetwork
 var voting_artifacts = voting_artifactsRinkeby;
}


// Import the page's CSS. Webpack will know what to do with it.


import dashboardCtrl from './controllers/dashboard.js';
import hoverbarController from './controllers/hoverbar.js';
import assetsCtrl from './controllers/assets.js';
import homepageController from './controllers/homepage.js';
import TransactionsCtrl from  './controllers/transactions.js';
import walletCtrl from  './controllers/wallet.js';
import testPaymentCtrl from  './controllers/testPaymentCtrl.js';



var app = angular.module("myApp", ['ngRoute', 'angularMoment'])
  .controller('dashboardCtrl', dashboardCtrl)
  .controller('hoverbarController', hoverbarController)
  .controller('assetsCtrl', assetsCtrl)
  .controller('homepageController', homepageController)
  .controller('TransactionsCtrl', TransactionsCtrl)
  .controller('walletCtrl', walletCtrl)
  .controller('testPaymentCtrl', testPaymentCtrl)

.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'homepageController'
      })     
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/dashboard',{
        templateUrl: 'partials/dashboard/main.html',
        controller: 'dashboardCtrl'
      })
      .when('/dashboard/:address', {
        templateUrl: 'partials/dashboard/main.html',
        controller: 'dashboardCtrl'
      })
      .when('/testpayment', {
        templateUrl: 'partials/testpayment.html',
        controller: 'testPaymentCtrl'
      })
      .otherwise({
        templateUrl: 'partials/404.html'
      });
});




setTimeout(function(){

var Voting = contract(voting_artifacts);


  window.getERC20 = function(){

    Voting.deployed().then(function(contractInstance) {
      window.contractInstance = contractInstance;
      contractInstance.symbol.call().then(function(v) {
        console.log('erc20 symbol is:', v);
      });
      contractInstance.name.call().then(function(v) {
        console.log('erc20 name is:', v);
      });
      contractInstance.decimals.call().then(function(v) {
        console.log('erc20 decimals is:', v);
      });
      contractInstance._totalSupply.call().then(function(v) {
        console.log('erc20 _totalSupply is:', v.toString());
      });
      contractInstance.owner.call().then(function(v) {
        console.log('erc20 owner is:', v);
      });
    });
  }


$( document ).ready(function() {

    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source like Metamask")
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
      window.accounts = new Accounts(web3.currentProvider);
      //Set MetaMaskInstalled Property
      window.metaMaskInstalled = true;
    } else {
      console.warn("No web3 detected. Falling back to   https://mainnet.infura.io. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)

      if(subDomain == "test"){ // check if we are wanting to use testnetwork
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/X3DitjB079q7GsMCtanI"));
        window.accounts = new Accounts(new Web3.providers.HttpProvider("https://rinkeby.infura.io/X3DitjB079q7GsMCtanI"));
      } else { // use mainnet
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/X3DitjB079q7GsMCtanI"));
        window.accounts = new Accounts(new Web3.providers.HttpProvider("https://mainnet.infura.io/X3DitjB079q7GsMCtanI"));
      }

      //Set MetaMaskInstalled Property
      window.metaMaskInstalled = false;
    }

    Voting.setProvider(web3.currentProvider);

    web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case "1":
          console.log('This is mainnet')
          break
        case "2":
          console.log('This is the deprecated Morden test network.')
          break
        case "3":
          console.log('This is the ropsten test network.')
          break
        default:
          console.log('This is an unknown network.')
      }
    })

  console.log('you are using -', web3.eth.accounts[0]);
  window.myaccounts = [web3.eth.accounts[0]];

  window.TraidHF = Voting;

  });

},2000)
