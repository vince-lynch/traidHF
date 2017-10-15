class hoverbarController {

    constructor($scope, $interval) {

	    $scope.stopTime = $interval(function(){
	    	if(typeof window.TraidHF != "undefined"){
		        $interval.cancel($scope.stopTime);

		       
		        $scope.connectedToEth = true;
		        console.log('loaded hoverbarController');
		        $scope.metamaskInstalled = window.metaMaskInstalled;

		    }
		  }, 1000);
    }

}
export default hoverbarController;
