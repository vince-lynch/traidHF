class testPaymentCtrl {

    constructor($scope, $interval) {

	    $scope.stopTime = $interval(function(){
	    	if(typeof window.TraidHF != "undefined"){
		        $interval.cancel($scope.stopTime);
		       
		        $scope.connectedToEth = true;
		        console.log('loaded testPaymentCtrl');

		        function randomPassword(length) {
				    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
				    var pass = "";
				    for (var x = 0; x < length; x++) {
				        var i = Math.floor(Math.random() * chars.length);
				        pass += chars.charAt(i);
				    }
				    console.log('called randomPassword', pass);
				    return pass;
				}

		        $scope.generatedPassword = randomPassword(16);

		    }
		  }, 1000);
    }

}
export default testPaymentCtrl;
