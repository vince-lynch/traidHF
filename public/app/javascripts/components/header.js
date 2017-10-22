const headerNav = {
  template: `
  <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
    <div class="container">
      <a class="navbar-brand js-scroll-trigger" href="#page-top">Crypto Asset House</a>
      <button class="navbar-toggler navbar-toggler-right" type="button"  aria-expanded="false" aria-label="Toggle navigation">
        Menu
        <i class="fa fa-bars"></i>
      </button>
      <div>
        <ul class="navbar-nav ml-auto">
        
          <li class="nav-item">
            <a class="nav-link js-scroll-trigger" href="#!start-today">Start Today</a>
          </li>
          <li class="nav-item">
            <a class="nav-link js-scroll-trigger" href="#!dashboard">Dashboard</a>
          </li>
           <li class="nav-item">
            <a class="nav-link js-scroll-trigger" href="#!team">Team</a>
          </li>
          <li class="nav-item">
            <a class="nav-link js-scroll-trigger" href="#!ico">ICO</a>
          </li>
          <li class="nav-item">
            <a class="nav-link js-scroll-trigger" href="#contact">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>


  <style>

@media (min-width: 768px){
	navbar-collapse.collapse {
	    display: initial !important;
	    height: initial !important;
	    padding-bottom: initial;
	    overflow: initial !important;
	}
}


#mainNav {
	border-color: rgba(34, 34, 34, 0.05);
	background-color: white;
	-webkit-transition: all .35s;
	-moz-transition: all .35s;
	transition: all .35s;
	font-family: 'Catamaran', 'Helvetica', 'Arial', 'sans-serif';
	font-weight: 200;
	letter-spacing: 1px; 
}
  #mainNav .navbar-brand {
    color: #fdcc52;
    font-family: 'Catamaran', 'Helvetica', 'Arial', 'sans-serif';
    font-weight: 200;
    letter-spacing: 1px; 
}
	    #mainNav .navbar-brand:hover, #mainNav .navbar-brand:focus {
	      color: #fcbd20; }
	  #mainNav .navbar-toggler {
	    font-size: 12px;
	    padding: 8px 10px;
	    color: #222222; }
	  #mainNav .navbar-nav > li > a {
	    font-size: 11px;
	    font-family: 'Lato', 'Helvetica', 'Arial', 'sans-serif';
	    letter-spacing: 2px;
	    text-transform: uppercase; }
	    #mainNav .navbar-nav > li > a.active {
	      color: #fdcc52 !important;
	      background-color: transparent; }
	      #mainNav .navbar-nav > li > a.active:hover {
	        background-color: transparent; }
	  #mainNav .navbar-nav > li > a,
	  #mainNav .navbar-nav > li > a:focus {
	    color: #222222; }
	    #mainNav .navbar-nav > li > a:hover,
	    #mainNav .navbar-nav > li > a:focus:hover {
	      color: #fdcc52; }
	  @media (min-width: 992px) {
	    #mainNav {
	      border-color: transparent;
	      background-color: transparent; }
	      #mainNav .navbar-brand {
	        color: fade(white, 70%); }
	        #mainNav .navbar-brand:hover, #mainNav .navbar-brand:focus {
	          color: white; }
	      #mainNav .navbar-nav > li > a,
	      #mainNav .navbar-nav > li > a:focus {
	        color: rgba(255, 255, 255, 0.7); }
	        #mainNav .navbar-nav > li > a:hover,
	        #mainNav .navbar-nav > li > a:focus:hover {
	          color: white; }
	      #mainNav.navbar-shrink {
	        border-color: rgba(34, 34, 34, 0.1);
	        background-color: white; }
	        #mainNav.navbar-shrink .navbar-brand {
	          color: #222222; }
	          #mainNav.navbar-shrink .navbar-brand:hover, #mainNav.navbar-shrink .navbar-brand:focus {
	            color: #fdcc52; }
	        #mainNav.navbar-shrink .navbar-nav > li > a,
	        #mainNav.navbar-shrink .navbar-nav > li > a:focus {
	          color: #222222; }
	          #mainNav.navbar-shrink .navbar-nav > li > a:hover,
	          #mainNav.navbar-shrink .navbar-nav > li > a:focus:hover {
	            color: #fdcc52; } }

  </style>
 `,
  controller($scope, $http) {


  	}
};

export default headerNav;