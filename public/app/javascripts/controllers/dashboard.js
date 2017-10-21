class dashboardCtrl {

    constructor($scope, $interval, $routeParams, BasicService) {

      $scope.currentView = 'overview';

      $scope.changeView = function(viewname){
        $scope.currentView = viewname;
      }

      $scope.accounts = BasicService.connectedWallet($routeParams); 

    }

}
export default dashboardCtrl;
