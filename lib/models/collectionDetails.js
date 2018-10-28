var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

function encrypt(text) {
	try
	{
		if (text === null || typeof text === 'undefined') { return text; };
		var cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTED_KEY);
		var crypted = cipher.update(text,'utf8','hex');
		crypted += cipher.final('hex');
	}
	catch(err)
	{}
	return crypted;
} 

function decrypt(text) {
	try
	{

		if (text === null || typeof text === 'undefined') {return text;};
		var decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTED_KEY);
		var dec = decipher.update(text,'hex','utf8');
		dec += decipher.final('utf8');
	}	
	catch(err)
	{}	
	return dec;
}


var collectionDetails = new Schema(
{
		memberid:{firstname:{ type: String, get: decrypt, set: encrypt},
				midname:{ type: String, get: decrypt, set: encrypt},
				lastname:{ type: String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
		accountid:{planid:{ type: String, get: decrypt, set: encrypt},
				accounttypeid:{ type: String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
		collectedamount:{type: String, get: decrypt, set: encrypt},
		dateofcollection:Date,
		collectionstatus:Number,
		nocollectionreason:{type: String, get: decrypt, set: encrypt},
		memberapproval:{type: String, get: decrypt, set: encrypt},
		branchapproval:{type: String, get: decrypt, set: encrypt},
		createdby:String,
		ceateddate:Date,
});

collectionDetails.set('toJSON', { getters: true, setters: true ,virtuals: true});
collectionDetails.set('toObject', { getters: true, setters: true,virtuals: true });


mongoose.model('collectionDetails', collectionDetails);