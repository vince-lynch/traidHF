const AssetEvent = require('../models/assetEvent');



var calculateDiff = function(buyId, sellId){
	AssetEvent.findOne({ _id: buyId, _BuyOrSell: 'BUY' }, function(err, buyT) {

		AssetEvent.findOne({ _id: sellId, _BuyOrSell: 'SELL' }, function(err, sellT) {

			var percentChanged = getPercentageChange(buyT.tradeTransaction.close, sellT.tradeTransaction.close);
			var capitalGained = sellT._amount /  100 * percentChanged;

			console.log('% change: ', (percentChanged - 100).toFixed(2), '%')
			console.log('capital was', sellT._amount);
			console.log('capitalGained', capitalGained);
	    });
    });
}


var updateUserLedger = function(buyerAddress, symbol){
  var i = 0;
  var lastLedger = 0;

  AssetEvent.find({ _buyer: buyerAddress, _assetTkn: symbol, tradeTransaction: {$exists: true}}).sort({_now: 1})
	.stream()

	.on('data', function(doc){
		//console.log('DATA', doc)
		/**
			Set Initial transaction ledger to be minus
		**/
		if(i == 0 && doc._BuyOrSell == 'BUY'){ // first transaction must always be a buy
			doc.set( '_ledger', 0 - doc.tradeTransaction._SUM );

			// set lastLedger for the next transaction
			lastLedger =  doc.tradeTransaction._SUM;

			//console.log('last ledger', lastLedger);
			doc.save(function(err){});
		} else {
		/**
			Add the Ledger to the transaction
		**/
			if(doc._BuyOrSell == 'BUY'){
				doc.set( '_ledger', 0 -(doc.tradeTransaction._SUM - lastLedger) );
				// set lastLedger for the next transaction
				lastLedger = doc.tradeTransaction._SUM - lastLedger;
			} else {
				doc.set( '_ledger', (doc.tradeTransaction._SUM - lastLedger));
				// set lastLedger for the next transaction
				lastLedger = doc.tradeTransaction._SUM - lastLedger;
			}

			doc.save(function(err){});
		}
		i++;
		//console.log('DOC,',doc);
	})
	.on('error', function(error) {
	  //throw error;
	})
	.on('end', function() {
	  // final callback
	});
}
//updateUserLedger('0x94784ddD87886B17C3736c8BeAE738a5Df9538c3', 'Amz');


/**
 * Calculates in percent, the change between 2 numbers.
 * e.g from 1000 to 500 = 50%
 * 
 * @param oldNumber The initial value
 * @param newNumber The value that changed
 */
function getPercentageChange(oldNumber, newNumber){
	var percent = (+newNumber / +oldNumber) * 100
    //var decreaseValue = oldNumber - newNumber;
    return percent;//(decreaseValue / oldNumber) * 100;
}



module.exports = {
  updateUserLedger: updateUserLedger
}

