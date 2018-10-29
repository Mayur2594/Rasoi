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


var itemsDetails = new Schema(
{
	item:{ type: String, get: decrypt, set: encrypt},
	description:{ type: String, get: decrypt, set: encrypt},
	unitrate:{ type: Number},
	pic:{ type: String, get: decrypt, set: encrypt},
	display:{ type: String, get: decrypt, set: encrypt,default:'No'},
	ceatedby:[{ type: Schema.Types.ObjectId, ref: 'agentDetails' }],
	
});

itemsDetails.set('toJSON', { getters: true, setters: true ,virtuals: true});
itemsDetails.set('toObject', { getters: true, setters: true,virtuals: true });


mongoose.model('itemsDetails', itemsDetails);