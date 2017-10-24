export default class BalanceService {
  constructor() {
    'ngInject';

    console.log('loaded BalanceService');

    this.fromService = 'result from service';


    window.balanceData = {
    	tokenBalance: 0,
    	tokenBalanceFinney: 0,
    	walletBalance: 0,
    	walletBalanceEth: 0
    }

    this.getBalances = function(){
    	return new Promise((resolve, reject)=>{

			  var getBalance = function(address){
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

			  var getTokenBalance = function(){
				  window.Cryptoah.deployed().then(function(contractInstance) {
				    contractInstance.getBalance.call(window.myaccounts[0]).then(function(v) {
				        window.balanceData.tokenBalance = v.toString();
				        window.balanceData.tokenBalanceFinney = window.balanceData.tokenBalance / 1000000000000000000;
						    resolve(); // end of promise
				    });
				  });
			  }

			  getBalance(window.myaccounts[0]).then(function(res){
			    window.balanceData.walletBalance = res.toString();
			    window.balanceData.walletBalanceEth = (window.balanceData.walletBalance / 1000000000000000000).toFixed(4);
					getTokenBalance();
			  })

			  // if no balance data in 3 seconds assume their wallet isn't connected
			  setTimeout(()=>{
			  	reject();
			  }, 3000)
	    })
    }




  }


}

