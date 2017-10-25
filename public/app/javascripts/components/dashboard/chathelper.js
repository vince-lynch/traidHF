const chatHelper = {
  template:`
  <div class="page" ng-show="showChat">
  <div class="overlay"></div>
  <div class="marvel-device nexus5">
    <div class="top-bar"></div>
    <div class="sleep"></div>
    <div class="volume"></div>
    <div class="camera"></div>
    <div class="screen">
      <div class="screen-container">
        <div class="status-bar">
          <div class="time"></div>
          <div class="battery">
            <i class="zmdi zmdi-battery"></i>
          </div>
          <div class="network">
            <i class="zmdi zmdi-network"></i>
          </div>
          <div class="wifi">
            <i class="zmdi zmdi-wifi-alt-2"></i>
          </div>
          <div class="star">
            <i class="zmdi zmdi-star"></i>
          </div>
        </div>
        <div class="chat">
          <div class="chat-container">
            <div class="user-bar">
              <div class="back">
                <i class="zmdi zmdi-arrow-left"></i>
              </div>
              <div class="avatar">
                <img src="https://avatars2.githubusercontent.com/u/398893?s=128" alt="Avatar">
              </div>
              <div class="name">
                <span>Zeno Rocha</span>
                <span class="status">online</span>
              </div>
              <div class="actions more">
                <i class="zmdi zmdi-more-vert"></i>
              </div>
              <div class="actions attachment">
                <i class="zmdi zmdi-attachment-alt"></i>
              </div>
              <div class="actions">
                <i class="zmdi zmdi-phone"></i>
              </div>
            </div>
            <div class="conversation">
              <div class="conversation-container">
<!--                 <div class="message sent">
                  What happened last night?
                  <span class="metadata">
                      <span class="time"></span><span class="tick"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg></span>
                  </span>
                </div>
                <div class="message received">
                  You were drunk.
                  <span class="metadata"><span class="time"></span></span>
                </div> -->
<!--                 <div class="message sent">
                  No I wasn't.
                  <span class="metadata">
                      <span class="time"></span><span class="tick"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg></span>
                  </span>
                </div> -->
<!--                 <div class="message received">
                  <span id="random">...</span>
                  <span class="metadata"><span class="time"></span></span>
                </div> -->
              </div>
              <form class="conversation-compose">
                <div class="emoji">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" id="smiley" x="3147" y="3209"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.153 11.603c.795 0 1.44-.88 1.44-1.962s-.645-1.96-1.44-1.96c-.795 0-1.44.88-1.44 1.96s.645 1.965 1.44 1.965zM5.95 12.965c-.027-.307-.132 5.218 6.062 5.55 6.066-.25 6.066-5.55 6.066-5.55-6.078 1.416-12.13 0-12.13 0zm11.362 1.108s-.67 1.96-5.05 1.96c-3.506 0-5.39-1.165-5.608-1.96 0 0 5.912 1.055 10.658 0zM11.804 1.01C5.61 1.01.978 6.034.978 12.23s4.826 10.76 11.02 10.76S23.02 18.424 23.02 12.23c0-6.197-5.02-11.22-11.216-11.22zM12 21.355c-5.273 0-9.38-3.886-9.38-9.16 0-5.272 3.94-9.547 9.214-9.547a9.548 9.548 0 0 1 9.548 9.548c0 5.272-4.11 9.16-9.382 9.16zm3.108-9.75c.795 0 1.44-.88 1.44-1.963s-.645-1.96-1.44-1.96c-.795 0-1.44.878-1.44 1.96s.645 1.963 1.44 1.963z" fill="#7d8489"/></svg>
                </div>
                <input class="input-msg" ng-model="theInput" name="input" placeholder="Type a message" autocomplete="off" autofocus ng-keyup="$event.keyCode == 13 ? sendMessage(theInput) : null"></input>
                <div class="photo">
                  <i class="zmdi zmdi-camera"></i>
                </div>
                <button type="button"
                        ng-click="sendMessage(theInput)"
                        class="send">
                    <div class="circle">
                      <i class="zmdi zmdi-mail-send"></i>
                    </div>
                  </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<style>
*, *:before, *:after {
  box-sizing: inherit;
}

html {
  box-sizing: border-box;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0;
  height: 100%;
}

chat-helper .overlay {
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: 990;
    background: rgba(0, 0, 0, 0.43);
    top: 0px;
    left: 0px;
}
.overlay.ng-hide{
  transition:0.5s linear all;
  opacity:0;
}
.overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:0.5s linear all;
  opacity:1;
}


.marvel-device .screen {
  text-align: left;
}

.screen-container {
    height: 300px;
    background: #f4f3ef;
    position: fixed;
    right: 12px;
    z-index: 1000;
    bottom: 65px;
    border-radius: 12px 12px 0px 0px;
    border: 1px solid #cac1c1;
}

/* Status Bar */

.status-bar {
  display: none;
  height: 25px;
  background: #004e45;
  color: #fff;
  font-size: 14px;
  padding: 0 8px;
}

.status-bar:after {
  content: "";
  display: table;
  clear: both;
}

.status-bar div {
  float: right;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 0 0 8px;
  font-weight: 600;
}

/* Chat */

.chat {
  height: calc(100% - 69px);
}

.chat-container {
  height: 100%;
}

/* User Bar */

.user-bar {
  display: none;
  height: 55px;
  background: #005e54;
  color: #fff;
  padding: 0 8px;
  font-size: 24px;
  position: relative;
  z-index: 1;
}

.user-bar:after {
  content: "";
  display: table;
  clear: both;
}

.user-bar div {
  float: left;
  transform: translateY(-50%);
  position: relative;
  top: 50%;
}

.user-bar .actions {
  float: right;
  margin: 0 0 0 20px;
}

.user-bar .actions.more {
  margin: 0 12px 0 32px;
}

.user-bar .actions.attachment {
  margin: 0 0 0 30px;
}

.user-bar .actions.attachment i {
  display: block;
  transform: rotate(-45deg);
}

.user-bar .avatar {
  margin: 0 0 0 5px;
  width: 36px;
  height: 36px;
}

.user-bar .avatar img {
  border-radius: 50%;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
  display: block;
  width: 100%;
}

.user-bar .name {
  font-size: 17px;
  font-weight: 600;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  margin: 0 0 0 8px;
  overflow: hidden;
  white-space: nowrap;
  width: 110px;
}

.user-bar .status {
  display: block;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
}

/* Conversation */

.conversation {
    height: calc(100% - 12px);
    position: relative;
    /* background: #efe7dd url(https://cloud.githubusercontent.com/assets/398893/15136779/4e765036-1639-11e6-9201-67e728e86f39.jpg) repeat; */
    z-index: 0;
    width: 323px;
}

.conversation ::-webkit-scrollbar {
  transition: all .5s;
  width: 5px;
  height: 1px;
  z-index: 10;
}

.conversation ::-webkit-scrollbar-track {
  background: transparent;
}

.conversation ::-webkit-scrollbar-thumb {
  background: #b3ada7;
}

.conversation .conversation-container {
  height: 300px;
  overflow-x: hidden;
  padding: 0 16px;
  margin-bottom: 5px;
}

.conversation .conversation-container:after {
  content: "";
  display: table;
  clear: both;
}

/* Messages */

.message {
  color: #000;
  clear: both;
  line-height: 18px;
  font-size: 15px;
  padding: 8px;
  position: relative;
  margin: 8px 0;
  max-width: 85%;
  word-wrap: break-word;
  z-index: -1;
}

.message:after {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border-style: solid;
}

.metadata {
  display: inline-block;
  float: right;
  padding: 0 0 0 7px;
  position: relative;
  bottom: -4px;
}

.metadata .time {
  color: rgba(0, 0, 0, .45);
  font-size: 11px;
  display: inline-block;
}

.metadata .tick {
  display: inline-block;
  margin-left: 2px;
  position: relative;
  top: 4px;
  height: 16px;
  width: 16px;
}

.metadata .tick svg {
  position: absolute;
  transition: .5s ease-in-out;
}

.metadata .tick svg:first-child {
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  -webkit-transform: perspective(800px) rotateY(180deg);
          transform: perspective(800px) rotateY(180deg);
}

.metadata .tick svg:last-child {
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  -webkit-transform: perspective(800px) rotateY(0deg);
          transform: perspective(800px) rotateY(0deg);
}

.metadata .tick-animation svg:first-child {
  -webkit-transform: perspective(800px) rotateY(0);
          transform: perspective(800px) rotateY(0);
}

.metadata .tick-animation svg:last-child {
  -webkit-transform: perspective(800px) rotateY(-179.9deg);
          transform: perspective(800px) rotateY(-179.9deg);
}

.message:first-child {
  margin: 16px 0 8px;
}

.message.received {
  background: #fff;
  border-radius: 0px 5px 5px 5px;
  float: left;
}

.message.received .metadata {
  padding: 0 0 0 16px;
}

.message.received:after {
  border-width: 0px 10px 10px 0;
  border-color: transparent #fff transparent transparent;
  top: 0;
  left: -10px;
}

.message.sent {
  background: #e1ffc7;
  border-radius: 5px 0px 5px 5px;
  float: right;
}

.message.sent:after {
  border-width: 0px 0 10px 10px;
  border-color: transparent transparent transparent #e1ffc7;
  top: 0;
  right: -10px;
}

/* Compose */

.conversation-compose {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  overflow: hidden;
  height: 50px;
  width: 100%;
  z-index: 1000;
}

.conversation-compose div,
.conversation-compose input {
  background: #fff;
  height: 100%;
}

.conversation-compose .emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 5px 0 0 5px;
  flex: 0 0 auto;
  margin-left: 8px;
  width: 48px;
}

.conversation-compose .input-msg {
  border: 0;
  flex: 1 1 auto;
  font-size: 16px;
  margin: 0;
  outline: none;
  min-width: 50px;
}

.conversation-compose .photo {
  flex: 0 0 auto;
  border-radius: 0 0 5px 0;
  text-align: center;
  position: relative;
  width: 48px;
}

.conversation-compose .photo:after {
  border-width: 0px 0 10px 10px;
  border-color: transparent transparent transparent #fff;
  border-style: solid;
  position: absolute;
  width: 0;
  height: 0;
  content: "";
  top: 0;
  right: -10px;
}

.conversation-compose .photo i {
  display: block;
  color: #7d8488;
  font-size: 24px;
  transform: translate(-50%, -50%);
  position: relative;
  top: 50%;
  left: 50%;
}

.conversation-compose .send {
  background: transparent;
  border: 0;
  cursor: pointer;
  flex: 0 0 auto;
  margin-left: 8px;
  margin-right: 8px;
  padding: 0;
  position: relative;
  outline: none;
}

.conversation-compose .send .circle {
  background: #008a7c;
  border-radius: 50%;
  color: #fff;
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.conversation-compose .send .circle i {
  font-size: 24px;
  margin-left: 5px;
}

</style>
`,
  controller($rootScope, $scope, $http, $timeout, BalanceService, $location, $routeParams) {

  var generatePassword = function () {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }


  $scope.checkAccount = function(email){
    $http({method: 'POST', url: '/api/access/walletAddressFromEmail',data: { email: email }})
     .then(function successCallback(response) {
        console.log('success Response', response);

        $location.path('/dashboard/' + response.data.redirectAdd);
        $scope.promptMessage(5);

      }, function errorCallback(response) {
         console.log('error Response', response);
         //$scope.promptMessage(6);
         $scope.createAccount(email, generatePassword());
      });
  }


  $scope.createAccount = function(email, password){
    $http({method: 'POST', url: '/api/newAccount',data: { email: email, password: password }})
     .then(function successCallback(response) {
        console.log('success Response', response);
        $location.path('/dashboard/' + response.data.user.walletAddress);

      }, function errorCallback(response) {
         console.log('error Response', response);
      });
  }
  


  /* Meme */

  var messages = [
    {message: `Hi, Welcome to Cryptoah, we can see your new here. As your wallet isnt connected,
     do you have a wallet in Ethereum already [1], or another in crypto-currency [2] or is this your
     first venture into crypo? [3]`, element: 'div#overview-wallet', eleOff: [], displayOverlay: true},
    {message: `Great, lets get started...`, element: 'overview-tokens', eleOff: ['div#overview-wallet'], displayOverlay: true},
    {message: `If you already have an account, you need to install the MetaMask browser,
     extension to be able to transact using your Cryptoah dashboard, visit https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/related?hl=en and refresh this page once installed.`, element: 'overview-tokens', eleOff: ['div#overview-wallet'], displayOverlay: true},
    {message: `Unfortunately we don't have an exchange to accept Bitcoin, Litecoin etc, but ShapeShift does, for the moment use them to convert your Cryptocurrency into Ethereum and then load your Metamask wallet to use this site`, element: 'overview-tokens', eleOff: ['div#overview-wallet'], displayOverlay: true},
    {message: `Great, we can make you an wallet right now, what's your email address?`, element: 'div#overview-tokens', eleOff: ['div#overview-wallet'], displayOverlay: true},

    {message: `You already have an wallet stored with us, did you forget your password?`, element: 'overview-tokens', eleOff: ['div#overview-wallet'], displayOverlay: true},
    {message: `We don't have your account stored with us`, element: 'div#overview-tokens', eleOff: ['div#overview-wallet'], displayOverlay: true},
    {message: `Hey, we noticed you have a wallet with Cryptoah but you don't have any CAH tokens, lets fund the wallet, how would you like to fund, by paypal or by transfering ethereum to this wallet?`, element: 'div#overview-tokens', eleOff: [], displayOverlay: true},

    {message: `Congratulations you signed in and funded your wallet from paypal, to unlock your account to make transactions please reply 'password: *******' `, element: 'div#overview-tokens', eleOff: ['chat-helper .overlay'], displayOverlay: false},
    {message: `Great that was the correct password, your wallet is now unlocked for you to do transactions' `, element: 'div#overview-tokens', eleOff: ['chat-helper .overlay'], displayOverlay: false},
    {message: `That wasn't the correct password for the account, try another type 'password: ' followed by your password `, element: 'div#overview-tokens', eleOff: ['chat-helper .overlay'], displayOverlay: false},

  ];

  
  // Set CSS for Element on page your message is about.

  $scope.checkPassword = function(passwordInput){
    console.log('successfully called checkPassword from the previous message', passwordInput);
    $http({method: 'POST', url: '/api/checkPassword',data: { address: window.sessionStorage.getItem('address'), password: passwordInput }})
     .then(function successCallback(response) {
        console.log('checkPassword success Response', response);

        window.sessionStorage.setItem('password', response.data.password);
        $scope.promptMessage(9);

      }, function errorCallback(response) {
         console.log('checkPassword error Response', response);
         $scope.promptMessage(10);
    });
  }


  $scope.promptMessage = function(idx){
    let newMessage = messages[idx].message;
    let ele = messages[idx].element;
    let eleOff = messages[idx].eleOff;
    let displayOverlay = messages[idx].displayOverlay == true ? 'block' : 'none';
    let nextFunction = messages[idx].nextFunction;

    $('.conversation-container').append(`<div class="message received">
      <span id="random">${newMessage}</span>
      <span class="metadata"><span class="time"></span></span>
    </div>`);
    $(ele).ready(function() {
      $(ele).css('z-index', 2000);
    });
    $('chat-helper .overlay').ready(function() {
      $('chat-helper .overlay').css('display', displayOverlay);
    });
    
    var i = 0;
    for(i in eleOff){
      $(eleOff[0]).ready(function() {
        $(eleOff[0]).css('z-index', 0);
        $(eleOff[0]).css('background', 'initial');
      });
    }

    if(nextFunction != undefined){
      $scope[nextFunction](); // calls the next function
    }
  }


  BalanceService.getBalances().then(()=>{
    $scope.$apply(()=>{
      $scope.balanceData = window.balanceData;
      $scope.showChat = false;

      if($routeParams.address != undefined){
        $scope.showChat = true;

        if(parseInt(balanceData.tokenBalance) == 0){
          $scope.promptMessage(7);
        } else {
          $scope.promptMessage(8);
        }
        
      }
      
    })
  }).catch(()=>{
    $scope.$apply(()=>{
      $scope.balanceData = window.balanceData;
      $scope.showChat = true;
      $scope.promptMessage(0);
    })
  })
  



  var form = document.querySelector('.conversation-compose');
  var conversation = document.querySelector('.conversation-container');


  $scope.sendMessage = function(theInput){
    var input = theInput;

    console.log('theInput', theInput)

    if (theInput) {
      var message = buildMessage(theInput);
      conversation.appendChild(message);
      animateMessage(message);
    }

    theInput = '';
    conversation.scrollTop = conversation.scrollHeight;

    $timeout(()=>{
      if(input == '1'){
        $scope.promptMessage(2);
      } 
      if(input == '2'){
        $scope.promptMessage(3);
      }
      if(input == '3'){
        $scope.promptMessage(4);
      }
      if(input.includes('@')){
        $scope.checkAccount(input)
      }
      if(input.includes('password:')){
        $scope.checkPassword(input.split(': ')[1]);
      }
      
    },1200)
  }


  

  function buildMessage(text) {
    var element = document.createElement('div');

    element.classList.add('message', 'sent');

    element.innerHTML = text +
      '<span class="metadata">' +
        '<span class="time">' + moment().format('h:mm A') + '</span>' +
        '<span class="tick tick-animation">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck" x="2047" y="2061"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#92a58c"/></svg>' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg>' +
        '</span>' +
      '</span>';

    return element;
  }

  function animateMessage(message) {
    setTimeout(function() {
      var tick = message.querySelector('.tick');
      tick.classList.remove('tick-animation');


    }, 500);
  }
  }
};

export default chatHelper;