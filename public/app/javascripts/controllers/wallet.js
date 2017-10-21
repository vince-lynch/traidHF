class walletCtrl {

    constructor($scope,$interval, $routeParams, BasicService) {

      console.log('reached walletCtrl');      
      
      $scope.walletInUse = $scope.accounts[0];

      $scope.tokenBalance = 0;
      $scope.walletBalance = 0;
      $scope.withdrawAmount = 0;
      $scope.depositAmount = 0;

      console.log('serviceInjection', BasicService.fromService);
      $scope.accounts = BasicService.connectedWallet($routeParams); // find out whether user is connected via MetaMask/Mist or our own backend


      $scope.getBalance = function(address){
        var address = window.myaccounts[0];
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
            web3.eth.sendTransaction({from: web3.eth.accounts[0], to: window.Cryptoah.address, value: _amount}, function (error, result) {
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


      window.Cryptoah.deployed().then(function(contractInstance) {
        contractInstance.getBalance.call(window.myaccounts[0]).then(function(v) {
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
        window.Cryptoah.deployed().then(function(contractInstance) {
          contractInstance.withdraw($scope.withdrawAmount, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
            contractInstance.myBalance.call().then(function(v) {
              console.log('myBalance is:', v.toString());
            });
          });
        });
      }


    } // end constructor

}
export default walletCtrl;

