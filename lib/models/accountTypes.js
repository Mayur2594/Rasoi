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

var accountTypes = new Schema(
{
	accounttype:{ type: String, get: decrypt, set: encrypt},
	description:{ type: String, get: decrypt, set: encrypt},
	interestrate:{ type: String, get: decrypt, set: encrypt},
	guarantor:{ type: String, get: decrypt, set: encrypt,default:'No'},
	installments:{ type: String, get: decrypt, set: encrypt,default:'No'},
	noguarantors:{ type: String, get: decrypt, set: encrypt,default:'0'},
	createdby:String,
	createddate:Date
});

accountTypes.set('toJSON', { getters: true, setters: true ,virtuals: true});
accountTypes.set('toObject', { getters: true, setters: true,virtuals: true });


mongoose.model('accountTypes', accountTypes);