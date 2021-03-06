const mortgageForm = {
  template: `
    <form>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <style>
	    {{$ctrl.style}}
    </style>

    <div ng-include="'partials/home.html'"></div>


    </form> 
  `,
  controller($scope, $http) {

    $scope.soldTokens = 0;
    $scope.totalSupply = 1000;
    $scope.connectedToEth = true;


    $scope.getTotalRaised = function(){
      $http({method: 'GET',url: 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=DRDH19DFJ5G2S1GUZGYHJUQY39NQFBVIQJ'}).then(function successCallback(response) {
        console.log('price of ether', response.data.result.ethusd);
        $scope.totalRaised = (($scope.soldTokens / 1000000000000000000) * response.data.result.ethusd).toFixed(2);
        console.log('$scope.totalRaised', $scope.totalRaised);
      }, function errorCallback(response) {
        console.log('error in getting price of ether', response);
      });
    }

    console.log('reachingHere Twice (mortgage.js)');


    window.Cryptoah.deployed().then(function(contractInstance) {
      window.contractInstance = contractInstance;
      contractInstance.symbol.call().then(function(v) {
        console.log('erc20 symbol is:', v);
      });
      contractInstance.name.call().then(function(v) {
        console.log('erc20 name is:', v);
      });
      contractInstance.decimals.call().then(function(v) {
        console.log('erc20 decimals is:', v);
      });
      contractInstance._totalSupply.call().then(function(v) {
        console.log('erc20 _totalSupply is:', v.toString());
        $scope.$apply(function(){
          $scope.totalSupply = v.toString();
          $scope.soldTokens = 1000000000000000;

          $scope.getTotalRaised();
        })
      });
    });




    this.style = `
	/*!
	 * Start Bootstrap - New Age v4.0.0-beta (http://startbootstrap.com/template-overviews/new-age)
	 * Copyright 2013-2017 Start Bootstrap
	 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-new-age/blob/master/LICENSE)
	 */
	html,
	body {
	  width: 100%;
	  height: 100%; 
	  overflow-x: hidden;
	}

	body {
	  font-family: 'Muli', 'Helvetica', 'Arial', 'sans-serif'; }

	

	a {
	  color: #fdcc52;
	  -webkit-transition: all .35s;
	  -moz-transition: all .35s;
	  transition: all .35s; }
	  a:hover, a:focus {
	    color: #fcbd20; }

	hr {
	  max-width: 100px;
	  margin: 25px auto 0;
	  border-width: 1px;
	  border-color: rgba(34, 34, 34, 0.1); }

	hr.light {
	  border-color: white; }

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
	  font-family: 'Catamaran', 'Helvetica', 'Arial', 'sans-serif';
	  font-weight: 200;
	  letter-spacing: 1px; }

	p {
	  font-size: 18px;
	  line-height: 1.5;
	  margin-bottom: 20px; }

	section {
	  padding: 100px 0; }
	  section h2 {
	    font-size: 50px; }

	

	header.masthead {
	  position: relative;
	  width: 100%;
	  padding-top: 150px;
	  padding-bottom: 100px;
	  color: white;
	  background: url("../img/bg-pattern.png"), #7b4397;
	  background: url("../img/bg-pattern.png"), -webkit-linear-gradient(to left, #7b4397, #dc2430);
	  background: url("../img/bg-pattern.png"), linear-gradient(to left, #7b4397, #dc2430); }
	  header.masthead .header-content {
	    max-width: 500px;
	    margin-bottom: 100px;
	    text-align: center; }
	    header.masthead .header-content h1 {
	      font-size: 30px; }
	  header.masthead .device-container {
	    max-width: 325px;
	    margin-right: auto;
	    margin-left: auto; }
	    header.masthead .device-container .screen img {
	      border-radius: 3px; }
	  @media (min-width: 992px) {
	    header.masthead {
	      height: 100vh;
	      min-height: 775px;
	      padding-top: 0;
	      padding-bottom: 0; }
	      header.masthead .header-content {
	        margin-bottom: 0;
	        text-align: left; }
	        header.masthead .header-content h1 {
	          font-size: 50px; }
	      header.masthead .device-container {
	        max-width: 325px; } }

	section.download {
	  position: relative;
	  padding: 150px 0; }
	  section.download h2 {
	    font-size: 50px;
	    margin-top: 0; }
	  section.download .badges .badge-link {
	    display: block;
	    margin-bottom: 25px; }
	    section.download .badges .badge-link:last-child {
	      margin-bottom: 0; }
	    section.download .badges .badge-link img {
	      height: 60px; }
	    @media (min-width: 768px) {
	      section.download .badges .badge-link {
	        display: inline-block;
	        margin-bottom: 0; } }
	  @media (min-width: 768px) {
	    section.download h2 {
	      font-size: 70px; } }

	section.features .section-heading {
	  margin-bottom: 100px; }
	  section.features .section-heading h2 {
	    margin-top: 0; }
	  section.features .section-heading p {
	    margin-bottom: 0; }

	section.features .device-container,
	section.features .feature-item {
	  max-width: 325px;
	  margin: 0 auto; }

	section.features .device-container {
	  margin-bottom: 100px; }
	  @media (min-width: 992px) {
	    section.features .device-container {
	      margin-bottom: 0; } }

	section.features .feature-item {
	  padding-top: 50px;
	  padding-bottom: 50px;
	  text-align: center; }
	  section.features .feature-item h3 {
	    font-size: 30px; }
	  section.features .feature-item i {
	    font-size: 80px;
	    display: block;
	    margin-bottom: 15px;
	    background: -webkit-linear-gradient(to left, #7b4397, #dc2430);
	    background: linear-gradient(to left, #7b4397, #dc2430);
	    -webkit-background-clip: text;
	    -webkit-text-fill-color: transparent; }

	section.cta {
	  position: relative;
	  padding: 250px 0;
	  background-image: url("../img/bg-cta.jpg");
	  background-position: center;
	  -webkit-background-size: cover;
	  -moz-background-size: cover;
	  -o-background-size: cover;
	  background-size: cover; }
	  section.cta .cta-content {
	    position: relative;
	    z-index: 1; }
	    section.cta .cta-content h2 {
	      font-size: 50px;
	      max-width: 450px;
	      margin-top: 0;
	      margin-bottom: 25px;
	      color: white; }
	    @media (min-width: 768px) {
	      section.cta .cta-content h2 {
	        font-size: 80px; } }
	  section.cta .overlay {
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background-color: rgba(0, 0, 0, 0.5); }

	section.contact {
	  text-align: center; }
	  section.contact h2 {
	    margin-top: 0;
	    margin-bottom: 25px; }
	    section.contact h2 i {
	      color: #dd4b39; }
	  section.contact ul.list-social {
	    margin-bottom: 0; }
	    section.contact ul.list-social li a {
	      font-size: 40px;
	      line-height: 80px;
	      display: block;
	      width: 80px;
	      height: 80px;
	      color: white;
	      border-radius: 100%; }
	    section.contact ul.list-social li.social-twitter a {
	      background-color: #1da1f2; }
	      section.contact ul.list-social li.social-twitter a:hover {
	        background-color: #0d95e8; }
	    section.contact ul.list-social li.social-facebook a {
	      background-color: #3b5998; }
	      section.contact ul.list-social li.social-facebook a:hover {
	        background-color: #344e86; }
	    section.contact ul.list-social li.social-google-plus a {
	      background-color: #dd4b39; }
	      section.contact ul.list-social li.social-google-plus a:hover {
	        background-color: #d73925; }



	.bg-primary {
	  background: #fdcc52;
	  background: -webkit-linear-gradient(#fdcc52, #fdc539);
	  background: linear-gradient(#fdcc52, #fdc539); }

	  .h-100{
	    height: initial !important;
	  }

	.text-primary {
	  color: #fdcc52; }

	.no-gutter > [class*='col-'] {
	  padding-right: 0;
	  padding-left: 0; }

	.btn-outline {
	  color: white;
	  border: 1px solid;
	  border-color: white; 
	  cursor: pointer;
	}
	  .btn-outline:hover, .btn-outline:focus, .btn-outline:active, .btn-outline.active {
	    color: white;
	    border-color: #fdcc52;
	    background-color: #fdcc52; }

	.btn {
	  border-radius: 300px;
	  font-family: 'Lato', 'Helvetica', 'Arial', 'sans-serif';
	  letter-spacing: 2px;
	  text-transform: uppercase; }

	.btn-xl {
	  font-size: 11px;
	  padding: 15px 45px; }

    `
  }
};

export default mortgageForm;