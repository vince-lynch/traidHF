class testPaymentCtrl {

    constructor($scope, $interval) {

	    $scope.stopTime = $interval(function(){
	    	if(typeof window.TraidHF != "undefined"){
		        $interval.cancel($scope.stopTime);
		       
		        $scope.connectedToEth = true;
		        console.log('loaded testPaymentCtrl');

		    }
		  }, 1000);
    }

}
export default testPaymentCtrl;
