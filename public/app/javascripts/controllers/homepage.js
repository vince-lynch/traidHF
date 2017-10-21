class homepageController {

  constructor($scope, $interval, $http) {

    console.log('reached homepageController');
    $scope.soldTokens = 0;
    $scope.totalSupply = 1000;
    $scope.connectedToEth = true;


    $scope.getTotalRaised = function(){
      $http({method: 'GET',url: 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ'}).then(function successCallback(response) {
        console.log('price of ether', response.data.result.ethusd);
        $scope.totalRaised = (($scope.soldTokens / 1000000000000000000) * response.data.result.ethusd).toFixed(2);
        console.log('$scope.totalRaised', $scope.totalRaised);
      }, function errorCallback(response) {
        console.log('error in getting price of ether', response);
      });
    }

    window.Cryptoah.deployed().then(function(contractInstance) {
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
        $scope.$apply(function(){
          $scope.totalSupply = v.toString();
          $scope.soldTokens = 1000000000000000;

          $scope.getTotalRaised();
        })

      });

    });
  }
}
export default homepageController;

