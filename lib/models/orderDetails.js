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


var orderDetails = new Schema(
{
	memberid:[{ type: Schema.Types.ObjectId, ref: 'membersDetails' }],
	orderdetails:[{item:[{ type: Schema.Types.ObjectId, ref: 'itemsDetails' }],qty:{ type: String, get: decrypt, set: encrypt},netrate:{ type: String, get: decrypt, set: encrypt},review:{ type: String, get: decrypt, set: encrypt},
	note:{ type: String, get: decrypt, set: encrypt}}],
	orderaddress:{lat:{ type: String, get: decrypt, set: encrypt},lan:{ type: String, get: decrypt, set: encrypt},address:{ type: String, get: decrypt, set: encrypt}},
	acceptedby:[{ type: Schema.Types.ObjectId, ref: 'userdetails' }],
	offerid:[{ type: Schema.Types.ObjectId, ref: 'offerDetails' }],
	review:{ type: String, get: decrypt, set: encrypt},
	note:{ type: String, get: decrypt, set: encrypt},
	hidereview:{ type: String, get: decrypt, set: encrypt,default:'NO'},
	ceateddate:Date,
	
});

orderDetails.set('toJSON', { getters: true, setters: true ,virtuals: true});
orderDetails.set('toObject', { getters: true, setters: true,virtuals: true });


mongoose.model('orderDetails', orderDetails);