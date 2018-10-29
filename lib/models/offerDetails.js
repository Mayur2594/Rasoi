var mongoose = require('mongoose');
var crypto = require('crypto');
var shortid = require('shortid');
var Schema = mongoose.Schema;
var  AllModels = require('./AllModels');
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


var offerDetails = new Schema(
{
	name:{ type: String, get: decrypt, set: encrypt},
	terms:{ type: String, get: decrypt, set: encrypt},
	offercode:{ type: String, get: decrypt, set: encrypt},
	bannerimage:{ type: String, get: decrypt, set: encrypt},
	validityfrom:{ type: Date},
	validityto:{ type: Date},
	ceateddate:Date,
	ceatedby:[{ type: Schema.Types.ObjectId, ref: 'agentDetails' }],
	
});

offerDetails.set('toJSON', { getters: true, setters: true ,virtuals: true});
offerDetails.set('toObject', { getters: true, setters: true,virtuals: true });


mongoose.model('offerDetails', offerDetails);