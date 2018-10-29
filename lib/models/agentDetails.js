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

var addressdetails = new Schema({
	
	lat:{ type: String, get: decrypt, set: encrypt},
	lan:{ type: String, get: decrypt, set: encrypt},
	address:{ type: String, get: decrypt, set: encrypt}
	
	
});



addressdetails.set('toJSON', { getters: true, setters: true ,virtuals: true});
addressdetails.set('toObject', { getters: true, setters: true,virtuals: true });




var userdetails = new Schema({
	
	password:{ type: String, get: decrypt, set: encrypt},
	firstname:{ type: String, get: decrypt, set: encrypt},
	lastname:{ type: String, get: decrypt, set: encrypt},
	mobile:{ type: String, get: decrypt, set: encrypt},
	email:{ type: String, get: decrypt, set: encrypt},
	address:[{ type: Schema.Types.ObjectId, ref: 'addressdetails' }],
	role:{ type: String, get: decrypt, set: encrypt},
	profilpic:{ type: String, get: decrypt, set: encrypt},
	
	
});

userdetails.set('toJSON', { getters: true, setters: true ,virtuals: true});
userdetails.set('toObject', { getters: true, setters: true,virtuals: true });


var agentDetails = new Schema(
{
	firmname:{ type: String, get: decrypt, set: encrypt},
	ownerdetails:{firstname:{ type: String, get: decrypt, set: encrypt},
	midname:{ type: String, get: decrypt, set: encrypt},
	lastname:{ type: String, get: decrypt, set: encrypt}},
	contactdetails:{email:{ type: String, get: decrypt, set: encrypt},
	mobile1:{ type: String, get: decrypt, set: encrypt},
	mobile2:{ type: String, get: decrypt, set: encrypt}},
	companypic:{ type: String, get: decrypt, set: encrypt},
	address:[addressdetails],
	users:[userdetails],
	createddate:Date,
	adminapproval:{ type: String,default:'No'}
});

agentDetails.set('toJSON', { getters: true, setters: true ,virtuals: true});
agentDetails.set('toObject', { getters: true, setters: true,virtuals: true });



mongoose.model('agentDetails', agentDetails);