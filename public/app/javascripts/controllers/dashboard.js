class dashboardCtrl {

    constructor($scope, $interval, $routeParams, BasicService) {

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


          console.log('serviceInjection', BasicService.fromService);
          $scope.accounts = BasicService.connectedWallet($routeParams); // find out whether user is connected via MetaMask/Mist or our own backend


        }
      }, 1000);

    }

}
export default dashboardCtrl;
