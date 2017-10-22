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
`,
  controller($scope, $http) {


  	}
};

export default footerBar;