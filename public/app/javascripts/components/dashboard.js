const paperDashboard = {
  template:`


<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel="apple-touch-icon" sizes="76x76" href="assets/img/apple-icon.png">
	<link rel="icon" type="image/png" sizes="96x96" href="assets/img/favicon.png">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

	<title>Cryptoah</title>

	<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
	<meta name="viewport" content="width=device-width" />


	<!-- Bootstrap core CSS     -->
	<link href="assets/css/bootstrap.min.css" rel="stylesheet" />

	<!-- Animation library for notifications   -->
	<link href="assets/css/animate.min.css" rel="stylesheet"/>

	<!--  Paper Dashboard core CSS    -->
	<link href="assets/css/paper-dashboard.css" rel="stylesheet"/>


	<!--  CSS for Demo Purpose, don't include it in your project     -->
	<link href="assets/css/demo.css" rel="stylesheet" />


	<!--  Fonts and icons     -->
	<link href="http://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" rel="stylesheet">
	<link href='https://fonts.googleapis.com/css?family=Muli:400,300' rel='stylesheet' type='text/css'>
	<link href="assets/css/themify-icons.css" rel="stylesheet">

</head>
<body>

<div class="wrapper">
	<div class="sidebar" data-background-color="white" data-active-color="danger">

		<div class="sidebar-wrapper">
			<div class="logo">
				<a href="#!/" class="simple-text">
					Cryptoah
				</a>
			</div>

			<ul class="nav">
				<li class="active">
					<a ng-click="showSection('overview')">
						<i class="ti-panel"></i>
						<p>Dashboard</p>
					</a>
				</li>
				<li>
					<a ng-click="showSection('wallet')">
						<i class="ti-wallet"></i>
						<p>Wallet</p>
					</a>
				</li>
				<li>
					<a ng-click="showSection('asset-trades')">
						<i class="ti-pulse"></i>
						<p>Asset Tokens</p>
					</a>
				</li>
				<li>
					<a ng-click="showSection('trade')">
						<i class="ti-control-shuffle"></i>
						<p>Trade with Community</p>
					</a>
				</li>
				<li>
					<a>
						<i class="ti-bell"></i>
						<p>Notifications</p>
					</a>
				</li>
<!-- 				<li class="active-pro">
					<a href="upgrade.html">
						<i class="ti-export"></i>
						<p>Upgrade to PRO</p>
					</a>
				</li> -->
			</ul>
		</div>
	</div>

	<div class="main-panel">
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar bar1"></span>
						<span class="icon-bar bar2"></span>
						<span class="icon-bar bar3"></span>
					</button>
					<a class="navbar-brand" href="#">Dashboard</a>
				</div>
			</div>
		</nav>

		<dashboard-overview  ng-if="currentSection == 'overview'"></dashboard-overview>
		<asset-trades ng-if="currentSection == 'asset-trades'"></asset-trades>
		<wallet ng-if="currentSection == 'wallet'"></wallet>


		<footer class="footer">
			<div class="container-fluid">
				<nav class="pull-left">
					<ul>

						<li>
							<a >
								Team
							</a>
						</li>
						<li>
							<a >
							   ICO
							</a>
						</li>
						<li>
							<a>
								FAQ
							</a>
						</li>
					</ul>
				</nav>
				<div class="copyright pull-right">
					&copy; made with <i class="fa fa-heart heart"></i> by <a href="http://www.cryptoah.com">Cryptoah</a>
				</div>
			</div>
		</footer>

	</div>
</div>

</body>

	<!--   Core JS Files   -->
	<script src="assets/js/jquery-1.10.2.js" type="text/javascript"></script>
	<script src="assets/js/bootstrap.min.js" type="text/javascript"></script>

	<!--  Checkbox, Radio & Switch Plugins -->
	<script src="assets/js/bootstrap-checkbox-radio.js"></script>

	<!--  Notifications Plugin    -->
	<script src="assets/js/bootstrap-notify.js"></script>


	<!-- Paper Dashboard Core javascript and methods for Demo purpose -->
	<script src="assets/js/paper-dashboard.js"></script>

	<!-- Paper Dashboard DEMO methods, don't include it in your project! -->
	<!--<script src="assets/js/demo.js"></script> -->


	<style>
		@media (min-width: 768px){
			navbar-collapse.collapse {
				display: none !important;
				height: initial !important;
				padding-bottom: initial;
				overflow: initial !important;
			}
		}
	</style>

</html>


`,
  controller($rootScope, $scope, $interval, $routeParams, BasicService, $http) {
	   $scope.accounts = BasicService.connectedWallet($routeParams); 

	   $scope.showSection = function(sectionName){
		   $scope.currentSection = sectionName;
	   }
	   $scope.showSection('overview');

	   console.log('how many times HERE (dashboard.js)')


	   $scope.notifyMessage = function(String1, String2){
			$.notify({
				icon: 'ti-gift',
				message: "Welcome to <b>Cryptoah Dashboard</b> - "+ String1 + String2 + window.whichProvider

			},{
				type: 'success',
				timer: 4000
			});
	   }

	   if(window.myaccounts.length > 0){
	   	 $scope.notifyMessage('you are signed into your wallet ' + window.myaccounts[0], " using ");
	   } else {
	   	 $scope.notifyMessage('looks like you do not have a wallet yet,', 'but you are connected to the blockchain using our ');
	   }

	}
};

export default paperDashboard;