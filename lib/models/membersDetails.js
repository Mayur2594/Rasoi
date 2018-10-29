var mongoose = require('mongoose');
var crypto = require('crypto');
var shortid = require('shortid');
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


var membersDetails = new Schema(
{
	firstname:{ type: String, get: decrypt, set: encrypt},
	midname:{ type: String, get: decrypt, set: encrypt},
	lastname:{ type: String, get: decrypt, set: encrypt},
	address:[{lat:{ type: String, get: decrypt, set: encrypt},lan:{ type: String, get: decrypt, set: encrypt},address:{ type: String, get: decrypt, set: encrypt}}],
	email:{ type: String, get: decrypt, set: encrypt},
	mobile:{ type: String, get: decrypt, set: encrypt},
	password:{ type: String, get: decrypt, set: encrypt},
	ceateddate:Date,
	
});

membersDetails.set('toJSON', { getters: true, setters: true ,virtuals: true});
membersDetails.set('toObject', { getters: true, setters: true,virtuals: true });


mongoose.model('membersDetails', membersDetails);