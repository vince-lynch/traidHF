const dashboardOverview = {
  template:`
  <div class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-4 col-sm-6" id="overview-wallet">
                <div class="card">
                    <div class="content">
                        <div class="row">
                            <div class="col-xs-5">
                                <div class="icon-big icon-success text-center">
                                    <i class="ti-wallet"></i>
                                </div>
                            </div>
                            <div class="col-xs-7">
                                <div class="numbers">
                                    <p>Wallet</p>
                                    {{balanceData.walletBalanceEth}}
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            <hr />
                            <div class="stats">
                                <i class="ti-reload"></i> (Ethereum)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6" id="overview-tokens">
                <div class="card">
                    <div class="content">
                        <div class="row">
                            <div class="col-xs-5">
                                <div class="icon-big icon-warning text-center">
                                    <i class="ti-server"></i>
                                </div>
                            </div>
                            <div class="col-xs-7">
                                <div class="numbers">
                                    <p>CAh Tokens</p>
                                    {{balanceData.tokenBalanceFinney}}
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            <hr />
                            <div class="stats">
                                <i>Ξ</i> (finney)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6">
                <div class="card">
                    <div class="content">
                        <div class="row">
                            <div class="col-xs-5">
                                <div class="icon-big icon-danger text-center">
                                    <i class="ti-pulse"></i>
                                </div>
                            </div>
                            <div class="col-xs-7">
                                <div class="numbers">
                                    <p>Trades placed</p>
                                    {{numTrades}}
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            <hr />
                            <div class="stats">
                                <i class="ti-timer"></i> In the 30 days
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="col-lg-12 col-sm-6">
    </div>
</div>
<chat-helper></chat-helper>
`,
  controller($rootScope, $scope, $http, BalanceService) {

	/**
    GET ALL TRADES for WALLET ADDRESS
    **/
	$http({method: 'GET',url: '/api/allTrades/' + window.myaccounts[0]})
	.then(function successCallback(response) {
	  console.log('success Response', response);
	  $scope.allTrades = response.data.trades;
	  $scope.numTrades = response.data.numTrades;
	}, function errorCallback(response) {
	    console.log('error Response', response);
	});


	BalanceService.getBalances().then(()=>{
		$scope.$apply(()=>{
			$scope.balanceData = window.balanceData;
		})
	}).catch(()=>{
	  $scope.$apply(()=>{
			$scope.balanceData = window.balanceData;
		})
	})


  }
};

export default dashboardOverview;