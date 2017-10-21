class TransactionsCtrl {

    constructor($scope, $interval) {

		console.log('reached TransactionsCtrl');

		  $scope.transactions = [];

	    window.Cryptoah.deployed().then(function(contractInstance) {

	      var events = contractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
	      events.watch(function(error, result){
	        $scope.$apply(function(){
	          $scope.transactions.push(result);
	          console.log('allEvents', result);
	        })

	      });
	    });

    }

}
export default TransactionsCtrl;

