// Import the page's CSS. Webpack will know what to do with it.

// Import libraries we need.
import { default as Web3} from 'web3';
var Accounts = require('web3-eth-accounts');

import { default as contract } from 'truffle-contract'
 //import angular App
import angularApp from './angular-app.js';

import voting_artifacts from '../../build/contracts/Voting.json'


setTimeout(function(){

var Voting = contract(voting_artifacts);



// var unlockAccount =  web3.personal.unlockAccount(web3.eth.accounts[0], 'Treatment201!').then(function(res){
//   console.log('res', res);
// });
// console.log('account unlocked', unlockAccount);

// window.voteForCandidate = function(candidate) {
//   let candidateName = $("#candidate").val();
//   try {
//     $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
//     $("#candidate").val("");

//      Voting.deployed() returns an instance of the contract. Every call
//      * in Truffle returns a promise which is why we have used then()
//      * everywhere we have a transaction call
     
//     Voting.deployed().then(function(contractInstance) {
//       contractInstance.voteForCandidate(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
//         let div_id = candidates[candidateName];
//         return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
//           $("#" + div_id).html(v.toString());
//           $("#msg").html("");
//         });
//       });
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }

window.setString = function(_string) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.setString(_string, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
      contractInstance.someString.call().then(function(v) {
        console.log('somestring is:', v.toString());
      });
    });
  });
}

window.getString = function(){
    Voting.deployed().then(function(contractInstance) {
    contractInstance.getString.call().then(function(v) {
      console.log('getString is:', v);
    });
  });
}

window.getERC20 = function(){

  Voting.deployed().then(function(contractInstance) {
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
    });
    contractInstance.owner.call().then(function(v) {
      console.log('erc20 owner is:', v);
    });
  });
}

// ALL SETTERS NEED GAS
window.withdraw = function(_amount) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.withdraw(_amount, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
      contractInstance.myBalance.call().then(function(v) {
        console.log('myBalance is:', v.toString());
      });
    });
  });
}

// ALL GETTERS ARE CONSTANTS
window.getBalance = function(_address) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.getBalance.call(_address).then(function(v) {
      console.log('_address Balance is:', v.toString());
    });
  });
}

window.transferTo = function(_address, _amount) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.transfer(_address, _amount, {gas: 140000, from: web3.eth.accounts[1]}).then(function() {
      contractInstance.getBalance.call(_address).then(function(v) {
        console.log('Their Balance is:', v);
      });
    });
  });
}

window.killContract = function() {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.kill({gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
      console.log('contract probably killed');
    });
  });
}

window.changeSupply = function(_amount) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.admin("4", _amount, "0x5b430ae0158280215ce5ad27f6e48991db374864", {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
      contractInstance._totalSupply.call().then(function(v) {
        console.log('erc20 _totalSupply is:', v);
      });
    });
  });
}

window.sendFundsOut = function(_amount, _address) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.admin("1", _amount, _address, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
      console.log('Recievers balance is now', web3.eth.getBalance(_address));
    });
  });
}

window.checkAsset = function(_assetTkn) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.checkHoldingAsset.call(_assetTkn).then(function(v) {
      console.log('Holding ', v, "of " + _assetTkn);
    });
  });
}

window.sellAsset = function(_assetTkn, _amount) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.sellAsset(_assetTkn, _amount, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
      contractInstance.checkHoldingAsset.call(_assetTkn).then(function(v) {
        console.log('Now holding ', v, "of " + _assetTkn);
      });
    });
  });
}

window.buyAsset = function(_assetTkn, _amount) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.holdAsset(_assetTkn, _amount, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
      contractInstance.checkHoldingAsset.call(_assetTkn).then(function(v) {
        console.log('Now holding ', v, "of " + _assetTkn);
      });
    });
  });
}


window.listenEvents = function(){
  Voting.deployed().then(function(contractInstance) {
    var myEvent = contractInstance.LogDepositMade({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
    myEvent.watch(function(error, result){
       console.log('LogDepositMade', result);
    });

    var myEvent2 = contractInstance.AssetTransaction({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
    myEvent2.watch(function(error, result){
       console.log('AssetTransaction', result);
    });

    var myEvent3 = contractInstance.Transfer({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
    myEvent2.watch(function(error, result){
       console.log('Transfer', result);
    });

    var myEvent4 = contractInstance.LogWithdrawal({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
    myEvent2.watch(function(error, result){
       console.log('LogWithdrawal', result);
    });
  });
}


$( document ).ready(function() {

  

  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
    window.accounts = new Accounts(web3.currentProvider);
    //Set MetaMaskInstalled Property
    window.metaMaskInstalled = true;
  } else {
    console.warn("No web3 detected. Falling back to   https://mainnet.infura.io. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/X3DitjB079q7GsMCtanI"));
    window.accounts = new Accounts(new Web3.providers.HttpProvider("https://mainnet.infura.io/X3DitjB079q7GsMCtanI"));
    //Set MetaMaskInstalled Property
    window.metaMaskInstalled = false;
  }

  Voting.setProvider(web3.currentProvider);

  web3.version.getNetwork((err, netId) => {
    switch (netId) {
      case "1":
        console.log('This is mainnet')
        break
      case "2":
        console.log('This is the deprecated Morden test network.')
        break
      case "3":
        console.log('This is the ropsten test network.')
        break
      default:
        console.log('This is an unknown network.')
    }
  })

console.log('you are using -', web3.eth.accounts[0]);

  window.TraidHF = Voting;

  // StartApp

});

},2000)





