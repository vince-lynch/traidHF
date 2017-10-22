const footerBar = {
  template: `
<div class="hoverbar" ng-hide="metamaskInstalled">
  You need the Chrome Web Browser with the MetaMask Browser extension to view this site correctly. <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank"><img src="img/download-metamask.png" /></a>
</div>
<footer>
  <div class="container">
    <p>&copy; 2017 Traid HF. All Rights Reserved.</p>
    <ul class="list-inline">
      <li class="list-inline-item">
        <a href="#">Privacy</a>
      </li>
      <li class="list-inline-item">
        <a href="#">Terms</a>
      </li>
      <li class="list-inline-item">
        <a href="#">FAQ</a>
      </li>
    </ul>
  </div>
</footer>

<style>
	div.hoverbar {
	  position: fixed;
	  bottom: 0px;
	  background: #fdc741;
	  display: block;
	  width: 100%;
	  text-align: center;
	  color: unset;
	  cursor: pointer;
	  z-index: 2000;
	}

	div.hoverbar img{
	  position: absolute;
	  margin-top: -28px;
	  width: 170px;
	}


footer {
	padding: 25px 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.3);
    background-color: #222222;
    position: absolute;
    bottom: 0px;
    width: 100%; 
}
	  footer p {
	    font-size: 12px;
	    margin: 0; }
	  footer ul {
	    margin-bottom: 0; }
	    footer ul li a {
	      font-size: 12px;
	      color: rgba(255, 255, 255, 0.3); }
	      footer ul li a:hover, footer ul li a:focus, footer ul li a:active, footer ul li a.active {
	        text-decoration: none; }
</style>
`,
  controller($scope, $http) {


  	}
};

export default footerBar;