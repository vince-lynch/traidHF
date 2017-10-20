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

			$scope.sellAsset = function(_assetTkn, _amount) {
			  window.TraidHF.deployed().then(function(contractInstance) {
			    contractInstance.sellAsset(_assetTkn, _amount, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
			      contractInstance.checkHoldingAsset.call(_assetTkn).then(function(v) {
			        console.log('Now holding ', v, "of " + _assetTkn);
			      });
			    });
			  });
			}

			$scope.buyAsset = function(_assetTkn, _amount) {
			  window.TraidHF.deployed().then(function(contractInstance) {
			    contractInstance.holdAsset(_assetTkn, _amount, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
			      contractInstance.checkHoldingAsset.call(_assetTkn).then(function(v) {
			        console.log('Now holding ', v, "of " + _assetTkn);
			      });
			    });
			  });
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

