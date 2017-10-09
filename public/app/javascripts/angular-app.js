// Import the page's CSS. Webpack will know what to do with it.



var app = angular.module("myApp", ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'homepageController'
      })
      .when('/wallet', {
        templateUrl: 'partials/wallet.html',
        controller: 'walletCtrl'
      })
      .when('/transactions', {
        templateUrl: 'partials/transactions.html',
        controller: 'TransactionsCtrl'
      })
      
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        templateUrl: 'partials/404.html'
      });


  });

app.controller("homepageController", function($scope, $interval) {
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


app.controller("TransactionsCtrl", function($scope, $interval) {
  $scope.model = 'Hello WOrld';

  console.log('reached TransactionsCtrl');

  
  $scope.connectedToEth = false;
  $scope.transactions = [];

    $scope.stopTime = $interval(function(){
      
      if(typeof window.TraidHF != "undefined"){
        $interval.cancel($scope.stopTime);

        $scope.connectedToEth = true;

        window.TraidHF.deployed().then(function(contractInstance) {
          var myEvent = contractInstance.LogDepositMade({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
          myEvent.watch(function(error, result){
            $scope.$apply(function(){
             console.log('LogDepositMade', result);
             $scope.transactions.push(result);
            })

          });

          var myEvent2 = contractInstance.AssetTransaction({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
          myEvent2.watch(function(error, result){
              $scope.$apply(function(){
                console.log('AssetTransaction', result);
                $scope.transactions.push(result);
             })
          });

          var myEvent3 = contractInstance.Transfer({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
          myEvent2.watch(function(error, result){
              $scope.$apply(function(){
                 console.log('Transfer', result);
                 $scope.transactions.push(result);
             })
          });

          var myEvent4 = contractInstance.LogWithdrawal({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
          myEvent2.watch(function(error, result){
          	$scope.$apply(function(){
	             console.log('LogWithdrawal', result);
	             $scope.transactions.push(result);
             })
          });
        });


      }
    }, 1000);


});

app.controller("walletCtrl", function($scope, $interval) {
  $scope.model = 'Hello WOrld';

  console.log('reached walletCtrl');

  
  $scope.connectedToEth = false;
  $scope.walletInUse = "";


    $scope.stopTime = $interval(function(){
      
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
    }, 1000);


});

