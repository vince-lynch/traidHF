class hoverbarController {

    constructor($scope, $interval) {
    	if(typeof window.Cryptoah != "undefined"){
	       $scope.metamaskInstalled = true;
	    }
    }

}
export default hoverbarController;
