const paypalPayment = {
  template: `
<div class="container-fluid" style="height: 100vh; display: flex; align-items: center;
    justify-content: center;">

	<div style="margin-top: -150px;">
		<h1>Invest with US Dollars</h1>
		 <form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_top" style="text-align: center; margin: 0 auto;">
		<input type="hidden" name="cmd" value="_s-xclick">
		<input type="hidden" name="custom" value="{{generatedPassword}}"/>
		<input type="hidden" name="hosted_button_id" value="FK9395W2P5WYU">

		<input type="image" src="https://www.sandbox.paypal.com/en_US/GB/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">
		<img alt="" border="0" src="https://www.sandbox.paypal.com/en_GB/i/scr/pixel.gif" width="1" height="1">
		</form>
	</div>
   

</div>

<style>
  
/*
 * Base structure
 */
/* Move down content because we have a fixed navbar that is 50px tall */
body {
  padding-top: 50px;
}
.navbar{
  background: black !important;
}

.nav{
  display: initial !important; 
}

#mainNav .navbar-nav > li > a, #mainNav .navbar-nav > li > a:focus {
    color: rgba(255, 255, 255, 0.7) !important;
}

#mainNav .navbar-brand {
    color: white !important;
}
/*
 * Global add-ons
 */
.sub-header {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

/*
 * Top navigation
 * Hide default border to remove 1px line.
 */
.navbar-fixed-top {
  border: 0;
}

/*
 * Sidebar
 */
/* Hide for mobile, show later */
.sidebar {
  display: none;
  height: 100vh !important;
}

@media (min-width: 768px) {
  .sidebar {
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: block;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #f5f5f5;
    border-right: 1px solid #eee;
  }
}
/* Sidebar navigation */
.nav-sidebar {
  margin-right: -21px;
  /* 20px padding + 1px border */
  margin-bottom: 20px;
  margin-left: -20px;
  height: 100vh;
}

a{
   color: initial !important;
    /* -webkit-transition: all .35s; */
    -moz-transition: all .35s;
    /* transition: all .35s; */
}

.nav-sidebar > li > a {
  padding-right: 20px;
  padding-left: 20px;
  cursor:pointer;
}

.nav-sidebar > .active > a,
.nav-sidebar > .active > a:hover,
.nav-sidebar > .active > a:focus {
  color: #fff;
  background-color: #428bca;
}

/*
 * Main content
 */
.main {
  padding: 20px;
}

@media (min-width: 768px) {
  .main {
    padding-right: 40px;
    padding-left: 40px;
  }
}
.main .page-header {
  margin-top: 0;
}

/*
 * Placeholder dashboard ideas
 */
.placeholders {
  margin-bottom: 30px;
  text-align: center;
}

.placeholders h4 {
  margin-bottom: 0;
}

.placeholder {
  margin-bottom: 20px;
}

.placeholder img {
  display: inline-block;
  border-radius: 50%;
}


</style>`, 
  controller($scope, $http) {

    console.log('loaded testPaymentCtrl');

    function randomPassword(length) {
      var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
      var pass = "";
      for (var x = 0; x < length; x++) {
          var i = Math.floor(Math.random() * chars.length);
          pass += chars.charAt(i);
      }
      console.log('called randomPassword', pass);
      return pass;
    }

    $scope.generatedPassword = randomPassword(16);

    }
};

export default paypalPayment;
