export default class BasicService {
  constructor() {
    'ngInject';

    console.log('loaded BasicService');

    this.fromService = 'result from service';

  ///
  // Check whether they arrived here by MetaMask or one of our accounts
  //
	this.connectedWallet = function($routeParams){
	    if($routeParams.address != undefined){
	      console.log('Set address', $routeParams.address);
	      window.myaccounts = [$routeParams.address];
	      //$scope.accounts   = [$routeParams.address];
	    } else {
	      window.myaccounts = window.web3.eth.accounts;
	      //$scope.accounts   = window.web3.eth.accounts;
	    }
	    return window.myaccounts;
	}

  }

}
