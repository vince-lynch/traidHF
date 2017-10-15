class assetsCtrl {

    constructor($scope, $interval) {
        //this.searchService = searchService;

	    if(typeof window.TraidHF != "undefined"){
	      $interval.cancel($scope.stopTime);
	     
	      $scope.connectedToEth = true;
	      console.log('loaded assetsCtrl');

	      $scope.checkAsset = function(_assetTkn){
	        // window.TraidHF.deployed().then(function(contractInstance) {
	        //   contractInstance.checkHoldingAsset.call(_assetTkn).then(function(v) {
	        //     console.log('Holding ', v.toString(), "of " + _assetTkn);
	        //     $scope.$apply(function(){
	        //       return Number(v.toString())
	        //     })
	          
	        //   });
	        // });
	        return 0;
	      }


	      $scope.assetTransaction = [];

	      window.TraidHF.deployed().then(function(contractInstance) {
	        var myEvent2 = contractInstance.AssetTransaction({"_assetTkn":"\"Amz\""}, {fromBlock: 0, toBlock: 'latest'});
	        myEvent2.watch(function(error, result){
	           console.log('AssetTransaction', result);
	           $scope.$apply(function(){
	             $scope.assetTransaction.push(result);
	           })
	        });
	      });

	      $scope.tokenStocks = [
	        {tokenName: 'AplTokenz', stock: 'Apple inc', tknSym: 'Apl'},
	        {tokenName: 'AmzTokenz', stock: 'Amazon Inc', tknSym: 'Amz'},
	        {tokenName: 'UbrTokenz', stock: 'Uber Inc', tknSym: 'Ubr'},
	        {tokenName: 'TelsaTokenz', stock: 'Telsa Inc', tknSym: 'Tlsz'},
	      ]


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
export default assetsCtrl;

