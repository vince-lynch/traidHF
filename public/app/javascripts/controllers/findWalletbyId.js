class accessViaEmailController {

    constructor($scope, $interval, $http, $location) {

    	console.log('loaded accessViaEmailController');


    	$scope.accessWallet = function(email){

    		console.log('accessWallet function called');

	    	$http({method: 'POST', url: '/api/access/walletAddressFromEmail',data: { email: email }
				}).then(function successCallback(response) {
				    console.log('success Response', response);
				    $location.path('/dashboard/' + response.data.redirectAdd);

				  }, function errorCallback(response) {
				    console.log('error Response', response);
				  });

	    }




    }

}
export default accessViaEmailController;
