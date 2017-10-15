class dashboardCtrl {

    constructor($scope, $interval, $routeParams) {
        //this.searchService = searchService;

      console.log('Set address', $routeParams.address);
      window.myaccounts = ["0xb47f54104Af6EE5898405f4d992682640fF122a5"];
      
      

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


            if(window.myaccounts.length == 0){
              window.myaccounts = window.web3.eth.accounts;
              $scope.accounts = window.web3.eth.accounts;
            }
          

        }
      }, 1000);

    }

}
export default dashboardCtrl;
