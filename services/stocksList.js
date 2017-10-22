var stringSimilarity = require('string-similarity');

var stockList = [
	'AMZN',
	'APPL',
	'FB',
	'GOOGL',
	'TLSA'
]

/**
Tries to Correct Misspelt attempts at purchasing an asset, if we can't guess which stock they want
then we will just assume they meant Amazon.
/
Returns Boolean 
**/
var isListed = function(assetToken){
	return stockList.includes(assetToken);
}

/**
Tries to Correct Misspelt attempts at purchasing an asset, if we can't guess which stock they want
then we will just assume they meant Amazon.
/
Returns String - Correct NYSE SYMBOL
**/
var isMisspelt = function(assetToken){

    assetToken = assetToken.replace(/[^a-zA-Z ]/g, "");// remove any weird characters from astTokez

	var matches = stringSimilarity.findBestMatch(assetToken, stockList);

	var match = matches.target != undefined ? matches.target : matches.bestMatch.target ;

	if(match != undefined){
		return match;
	} else {
		return 'AMZN';
	}
}



module.exports = {
	isListed: isListed,
	isMisspelt: isMisspelt
}