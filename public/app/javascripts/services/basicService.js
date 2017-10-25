export default class BasicService {
  constructor($http) {
    'ngInject';

    console.log('loaded BasicService');

    this.fromService = 'result from service';

    // find out who is a user from their address
    this.storeUserDetails = function(address){
	    $http({method: 'POST', url: '/api/whoIsAddress',data: { address: address }})
	     .then(function successCallback(response) {
	        console.log('whoIsAddress success Response', response);

			window.sessionStorage.setItem('address', address);
	        window.sessionStorage.setItem('email', response.data.email);

	      }, function errorCallback(response) {
	         console.log('whoIsAddress error Response', response);
	      });
    }


  //
	this.connectedWallet = function($routeParams){

		// if logged in via routeParams address
	    if($routeParams.address != undefined){
	      console.log('Set address', $routeParams.address);
	      window.myaccounts = [$routeParams.address];
	      
	      // get user details for session storage so we can do transactions using their account later
	      this.storeUserDetails($routeParams.address); 

	      window.loggedinvia = 'paypal';
	    } else {
	      window.myaccounts = window.web3.eth.accounts;
	      //$scope.accounts   = window.web3.eth.accounts;
	      window.loggedinvia = 'metamask';
	    }
	    return window.myaccounts;
	}

  }

}
//sessionStorage.setItem('key', 'value');