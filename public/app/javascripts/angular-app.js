// Import the page's CSS. Webpack will know what to do with it.

var app = angular.module("myApp", ['ngRoute', 'angularMoment'])
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
      .otherwise({
        templateUrl: 'partials/404.html'
      });


  });

app.controller('dashboardCtrl', function($scope, $interval){
  $scope.currentView = 'overview';

  $scope.changeView = function(viewname){
    $scope.currentView = viewname;
  }

  $scope.stopTime = $interval(function(){
    if(typeof window.TraidHF != "undefined"){
        $interval.cancel($scope.stopTime);

       
        $scope.connectedToEth = true;
        console.log('loaded dashboardCtrl');
        $scope.metamaskInstalled = window.metaMaskInstalled;

        $scope.accounts = window.web3.eth.accounts;

    }
  }, 1000);
})


app.controller('hoverbarController', function($scope, $interval){
  $scope.stopTime = $interval(function(){
    if(typeof window.TraidHF != "undefined"){
        $interval.cancel($scope.stopTime);

       
        $scope.connectedToEth = true;
        console.log('loaded hoverbarController');
        $scope.metamaskInstalled = window.metaMaskInstalled;

    }
  }, 1000);
})


app.controller('assetsCtrl', function($scope, $interval){
  if(typeof window.TraidHF != "undefined"){
      $interval.cancel($scope.stopTime);
     
      $scope.connectedToEth = true;
      console.log('loaded assetsCtrl');

      $scope.checkAsset = function(_assetTkn){
        // window.TraidHF.deployed().then(function(contractInstance) {
        //   contractInstance.checkHoldingAsset.call(_assetTkn).then(function(v) {
        //     console.log('Holding ', v.toString(), "of " + _assetTkn);
        //     $scope.$apply(function(){
        //       return Number(v.toString())
        //     })
          
        //   });
        // });
        return 0;
      }


      $scope.assetTransaction = [];

      window.TraidHF.deployed().then(function(contractInstance) {
        var myEvent2 = contractInstance.AssetTransaction({"_assetTkn":"\"Amz\""}, {fromBlock: 0, toBlock: 'latest'});
        myEvent2.watch(function(error, result){
           console.log('AssetTransaction', result);
           $scope.$apply(function(){
             $scope.assetTransaction.push(result);
           })
        });
      });

      $scope.tokenStocks = [
        {tokenName: 'AplTokenz', stock: 'Apple inc', tknSym: 'Apl'},
        {tokenName: 'AmzTokenz', stock: 'Amazon Inc', tknSym: 'Amz'},
        {tokenName: 'UbrTokenz', stock: 'Uber Inc', tknSym: 'Ubr'},
        {tokenName: 'TelsaTokenz', stock: 'Telsa Inc', tknSym: 'Tlsz'},
      ]


  }
})


app.controller("homepageController", function($scope, $interval, moment) {
  $scope.model = 'Hello WOrld';

  console.log('reached homepageController');

  $scope.connectedToEth = false;
    $scope.stopTime = $interval(function(){
      
      if(typeof window.TraidHF != "undefined"){
        $interval.cancel($scope.stopTime);

        $scope.connectedToEth = true;

        window.TraidHF.deployed().then(function(contractInstance) {
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
            $scope.$apply(function(){
              $scope.totalSupply = v.toString();
              $scope.soldTokens =  0.02;
            })

          });
          contractInstance.owner.call().then(function(v) {
            console.log('erc20 owner is:', v);
            console.log('angular')
          });
        });
      }
    }, 1000);


  $scope.soldTokens = 0;
  $scope.totalSupply = 1000;


});


app.controller("TransactionsCtrl", function($scope, $interval, moment) {
  $scope.model = 'Hello WOrld';

  console.log('reached TransactionsCtrl');

  
  $scope.connectedToEth = false;
  $scope.transactions = [];

  if(typeof window.TraidHF != "undefined"){
    $interval.cancel($scope.stopTime);

    $scope.connectedToEth = true;

    window.TraidHF.deployed().then(function(contractInstance) {

      var events = contractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
      events.watch(function(error, result){
        $scope.$apply(function(){
          $scope.transactions.push(result);
          console.log('allEvents', result);
        })

      });
    });
  }


});

app.controller("walletCtrl", function($scope, $interval, moment) {
  $scope.model = 'Hello WOrld';

  console.log('reached walletCtrl');

  
  $scope.connectedToEth = false;
  $scope.walletInUse = "";

      
  if(typeof window.TraidHF != "undefined"){
    $interval.cancel($scope.stopTime);

    $scope.connectedToEth = true;
    $scope.walletInUse = web3.eth.accounts[0];
    $scope.tokenBalance = 0;
    $scope.walletBalance = 0;
    $scope.withdrawAmount = 0;
    $scope.depositAmount = 0;

    $scope.getBalance = function(address){
      return new Promise (function (resolve, reject) {
          web3.eth.getBalance(address, function (error, result) {
            if (error) {
              reject(error);
            } else {
              resolve(result);
          }
        })
      })
    }

    $scope.deposit = function(_amount){
      return new Promise (function (resolve, reject) {
          console.log('sending deposit transaction', _amount);
          web3.eth.sendTransaction({from: web3.eth.accounts[0], to: window.TraidHF.address, value: _amount}, function (error, result) {
            if (error) {
              reject(error);
            } else {
              resolve(result);
          }
        })
      })
    }

    $scope.getBalance($scope.walletInUse).then(function(res){
      console.log('getBalance, res', res.toString());
        $scope.$apply(function(){
          $scope.walletBalance = res.toString();
        })
    })


    window.TraidHF.deployed().then(function(contractInstance) {
      contractInstance.getBalance.call(web3.eth.accounts[0]).then(function(v) {
        console.log('_address tokenBalance is:', v.toString());
          $scope.$apply(function(res){
            $scope.tokenBalance = v.toString();
          })
        
      });
    });


    $scope.callDeposit = function(_amount){
      console.log('wallet ->callDeposit()', _amount);

      $scope.deposit(_amount).then(function(res){
        console.log('sendDeposit, res', res);
        //$scope.walletBalance = res.toString();
      })
    }

    $scope.callWithdraw = function(_amount){
      console.log('wallet ->callWithdraw()', $scope.withdrawAmount);
      window.TraidHF.deployed().then(function(contractInstance) {
        contractInstance.withdraw($scope.withdrawAmount, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
          contractInstance.myBalance.call().then(function(v) {
            console.log('myBalance is:', v.toString());
          });
        });
      });
      
    }

  } // end of if EthConnected


});
