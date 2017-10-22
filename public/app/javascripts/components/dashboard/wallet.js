const wallet = {
  template: `

<div class="card">           
    <div class="header">
        <h4 class="title">
	        <span>Wallet</span>&nbsp;<i class="ti-wallet"></i>
        </h4>
        <p class="category">
	           &nbsp;{{tokenBalanceFinney}} CAh Tokens <br/>
	           &nbsp;{{walletBalanceEth}} Ethereum <br/>
        </p>
    </div>
    <div class="content table-responsive table-full-width">

    </div>
</div>

<div class="row">           
	<div class="col-md-6">           
		<div class="card">           
		    <div class="header">
		        <h4 class="title">
			        <span>Deposits</span></i>
		        </h4>
		        <p class="category">
			        Deposits into your wallet
		        </p>
		    </div>
		    <div class="content table-responsive table-full-width">
			    <table class="table table-striped">
                    <thead>
                        <th>Tx</th>
                    	<th>Amount</th>
                    </thead>
                    <tbody>
	                    <tr ng-repeat="deposit in deposits[account] track by $index">
	                    	<td>
	                    		<a href="https://etherscan.io/tx/{{deposit.transactionHash}}">
		                    		{{deposit.transactionHash.slice(-5, -1)}}
		                    	</a>
	                    	</td>
	                    	<td style="color: green">
		                    	+{{deposit.args.amount}}
	                    	</td>
	                    </tr>
                    </tbody>
                </table>
		    </div>
		</div>
	

		<div class="card">
			<div class="header">
		        <h4 class="title">
			        <span>Fund Cryptoah</span></i>
		        </h4>
		        <p class="category">
			        Turn your Ethereum into CAh coins
		        </p>
		    </div>
		    <div class="content table-responsive table-full-width">
                <table class="table table-striped">
                    <thead>
                        <th>Amount</th>
                        <th>Deposit</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" ng-model="depositAmount" class="form-control"/></td>
                            <td>
                                <button 
                                ng-click="callDeposit(depositAmount)"
                                class="btn"
                                >Deposit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
		</div>

	</div>
	<div class="col-md-6">           
		<div class="card">           
		    <div class="header">
		        <h4 class="title">
			        <span>Withdrawals</span></i>
		        </h4>
		        <p class="category">
			       Withdrawals from your wallet
		        </p>
		    </div>
		    <div class="content table-responsive table-full-width">
			    <table class="table table-striped">
                    <thead>
                        <th>Tx</th>
                    	<th>Amount</th>
                    </thead>
                    <tbody>
	                    <tr ng-repeat="withdrawal in withdrawals[account] track by $index">
                    		<td>
	                    		<a href="https://etherscan.io/tx/{{withdrawal.transactionHash}}">
		                    		{{ withdrawal.transactionHash.slice(-5, -1) }}
		                    	</a>
		                    </td>
	                    	<td style="color: red">
	                    		-{{withdrawal.args.amount}}
	                    	</td>
	                    </tr>
                    </tbody>
                </table>
		    </div>
		</div>

		<div class="card">
			<div class="header">
		        <h4 class="title">
			        <span>Exchange Cryptoah</span></i>
		        </h4>
		        <p class="category">
			        Turn CAh coins to Ethereum
		        </p>
		    </div>
		    <div class="content table-responsive table-full-width">
                <table class="table table-striped">
                    <thead>
                        <th>Amount</th>
                        <th>withdraw</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" ng-model="withdrawAmount" class="form-control"/></td>
                            <td>
                                <button 
                                ng-click="callWithdraw(withdrawAmount)"
                                class="btn"
                                >withdraw</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
		</div>

	</div>
</div>

`,
  controller($scope, $http) {

  	$scope.account = window.myaccounts[0];


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

  $scope.deposit = function(_amount){
    return new Promise (function (resolve, reject) {
        console.log('sending deposit transaction', _amount);
        web3.eth.sendTransaction({from: web3.eth.accounts[0], to: window.Cryptoah.address, value: _amount}, function (error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
        }
      })
    })
  }

  $scope.callWithdraw = function(_amount){
    console.log('wallet ->callWithdraw()', $scope.withdrawAmount);
    window.Cryptoah.deployed().then(function(contractInstance) {
      contractInstance.withdraw($scope.withdrawAmount, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
        contractInstance.myBalance.call().then(function(v) {
          console.log('myBalance is:', v.toString());
        });
      });
    });
  }


  $scope.callDeposit = function(_amount){
    console.log('wallet ->callDeposit()', _amount);

    $scope.deposit(_amount).then(function(res){
      console.log('sendDeposit, res', res);
      //$scope.walletBalance = res.toString();
    })
  }

  $scope.deposits    = {};
  $scope.withdrawals = {};

   window.Cryptoah.deployed().then(function(contractInstance) {
	    var myEvent = contractInstance.LogDepositMade({accountAddress: window.myaccounts[0]}, {fromBlock: 0, toBlock: 'latest'});
	    myEvent.watch(function(error, result){
	       $scope.$apply(()=>{
	       	   $scope.deposits[window.myaccounts[0]] = [];
		       $scope.deposits[window.myaccounts[0]].push(result);
	       })
	    });

	    var myEvent2 = contractInstance.LogWithdrawal({accountAddress: window.myaccounts[0]}, {fromBlock: 0, toBlock: 'latest'});
	    myEvent2.watch(function(error, result){
	       $scope.$apply(()=>{
	       	console.log('withdraw event', result);
	       	   $scope.withdrawals[window.myaccounts[0]] = [];
		       $scope.withdrawals[window.myaccounts[0]].push(result);
	       })
	    });
	}) // end of events listener for deposits/withdrawals

  	}
};

export default wallet;