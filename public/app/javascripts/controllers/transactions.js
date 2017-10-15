class TransactionsCtrl {

    constructor($scope, $interval) {
        //this.searchService = searchService;

		console.log('reached TransactionsCtrl');

		  
		  $scope.connectedToEth = false;
		  $scope.transactions = [];

		  if(typeof window.TraidHF != "undefined"){
		    $interval.cancel($scope.stopTime);

		    $scope.connectedToEth = true;

		    window.TraidHF.deployed().then(function(contractInstance) {

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

    // search () {
    //     this.searchService
    //         .fetch(this.searchTerm)
    //         .then(response => {
    //             this.items = response.data.items;
    //         });
    // }
}
export default TransactionsCtrl;

// app.controller("TransactionsCtrl", function($scope, $interval, moment) {
//   $scope.model = 'Hello WOrld';

//   console.log('reached TransactionsCtrl');

  
//   $scope.connectedToEth = false;
//   $scope.transactions = [];

  // if(typeof window.TraidHF != "undefined"){
  //   $interval.cancel($scope.stopTime);

  //   $scope.connectedToEth = true;

  //   window.TraidHF.deployed().then(function(contractInstance) {

  //     var events = contractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
  //     events.watch(function(error, result){
  //       $scope.$apply(function(){
  //         $scope.transactions.push(result);
  //         console.log('allEvents', result);
  //       })

  //     });
  //   });
  // }
// });
