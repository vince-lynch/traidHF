const startToday = {
  template: `
<div class="row" style='margin-top: 182px; text-align: center;'>

	<div class="col-md-3"></div>

	<div id="already-wallet" class="col-md-3 start-choice">
		<img src="./img/Ethereum_logo_bw.png" width="140px"/>
		<br/>
		<span>Already got a wallet?<br/>
			<em style="font-size: 11px;">
				(Deposit today)
			</em>
		</span>
	</div>
	<div id="new-to-crypto"  class="col-md-3 start-choice">
		<a href="#!payment">
			<img src="./img/wallet.png" 
			width="125px" 
			style="padding-bottom: 15px;"
			 />
			<br/>
			<span>New to Crypto?<br/>
				<em style="font-size: 11px;">
					(We take pounds, dollars, yen)
				</em>
			</span>
		</a>
	</div>

	<div class="col-md-3"></div>
</div>

<style>
	.row{
		margin-right: 0px;
		margin-left: 0px;
	}
	#mainNav{
		background: black !important;
	}

	.start-choice{
		cursor: pointer;
	}
	
</style>
`,
  controller($scope, $http) {


  	}
};

export default startToday;