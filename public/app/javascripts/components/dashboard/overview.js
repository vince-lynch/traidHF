const dashboardOverview = {
  template:`
  <div class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-3 col-sm-6">
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
                                    {{walletBalanceEth}}
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
            <div class="col-lg-3 col-sm-6">
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
                                    {{tokenBalanceFinney}}
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
            <div class="col-lg-3 col-sm-6">
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
            <div class="col-lg-3 col-sm-6">
                <div class="card">
                    <div class="content">
                        <div class="row">
                            <div class="col-xs-5">
                                <div class="icon-big icon-info text-center">
                                    <i class="ti-twitter-alt"></i>
                                </div>
                            </div>
                            <div class="col-xs-7">
                                <div class="numbers">
                                    <p>Followers</p>
                                    +45
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            <hr />
                            <div class="stats">
                                <i class="ti-reload"></i> Updated now
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">

            <div class="col-md-12">
                <div class="card">
                    <div class="header">
                        <h4 class="title">Users Behavior</h4>
                        <p class="category">24 Hours performance</p>
                    </div>
                    <div class="content">
                        <div id="chartHours" class="ct-chart"></div>
                        <div class="footer">
                            <div class="chart-legend">
                                <i class="fa fa-circle text-info"></i> Open
                                <i class="fa fa-circle text-danger"></i> Click
                                <i class="fa fa-circle text-warning"></i> Click Second Time
                            </div>
                            <hr>
                            <div class="stats">
                                <i class="ti-reload"></i> Updated 3 minutes ago
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="header">
                        <h4 class="title">Email Statistics</h4>
                        <p class="category">Last Campaign Performance</p>
                    </div>
                    <div class="content">
                        <div id="chartPreferences" class="ct-chart ct-perfect-fourth"></div>

                        <div class="footer">
                            <div class="chart-legend">
                                <i class="fa fa-circle text-info"></i> Open
                                <i class="fa fa-circle text-danger"></i> Bounce
                                <i class="fa fa-circle text-warning"></i> Unsubscribe
                            </div>
                            <hr>
                            <div class="stats">
                                <i class="ti-timer"></i> Campaign sent 2 days ago
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card ">
                    <div class="header">
                        <h4 class="title">2015 Sales</h4>
                        <p class="category">All products including Taxes</p>
                    </div>
                    <div class="content">
                        <div id="chartActivity" class="ct-chart"></div>

                        <div class="footer">
                            <div class="chart-legend">
                                <i class="fa fa-circle text-info"></i> Tesla Model S
                                <i class="fa fa-circle text-warning"></i> BMW 5 Series
                            </div>
                            <hr>
                            <div class="stats">
                                <i class="ti-check"></i> Data information certified
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
  controller($rootScope, $scope, $http) {

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


   window.Cryptoah.deployed().then(function(contractInstance) {
    contractInstance.getBalance.call(window.myaccounts[0]).then(function(v) {
      console.log('_address tokenBalance is:', v.toString());
        $scope.$apply(function(res){
          $scope.tokenBalance = v.toString();
          $scope.tokenBalanceFinney = $scope.tokenBalance / 1000000000000000000;
        })
      
    });
  });

  $scope.getBalance = function(address){
    var address = window.myaccounts[0];
    return new Promise (function (resolve, reject) {
        web3.eth.getBalance(address, function (error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
        }
      })
    })
  }

  $scope.getBalance($scope.walletInUse).then(function(res){
    console.log('getBalance, res', res.toString());
      $scope.$apply(function(){
        $scope.walletBalance = res.toString();
        $scope.walletBalanceEth = ($scope.walletBalance / 1000000000000000000).toFixed(4);
      })
  })


	demo.initChartist();

  }
};

export default dashboardOverview;