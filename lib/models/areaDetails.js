var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

function encrypt(text) {
	try
	{
		if (text === null || typeof text === 'undefined') { return text; }
		
		var cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTED_KEY);
		var crypted = cipher.update(text,'utf8','hex');
		crypted += cipher.final('hex');
		
	}
	catch(err)
	{}
	return crypted;
} 

function decrypt(text) {
	if (text === null || typeof text === 'undefined') {return text;}
	else
	{
	try
	{
		var decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTED_KEY);
		var dec = decipher.update(text,'hex','utf8');
		dec += decipher.final('utf8');
	}	
	catch(err)
	{}	
	
	return dec;
	}
}

var areaDetails = new Schema(
{
	areaname:{ type: String, get: decrypt, set: encrypt},
	description:{ type: String, get: decrypt, set: encrypt},
	areacode:{ type: String, get: decrypt, set: encrypt},
	branchid:{branchname:{type:String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
});


areaDetails.set('toObject', { getters: true, setters: true,virtuals: true });
areaDetails.set('toJSON', { getters: true, setters: true ,virtuals: true});

mongoose.model('areaDetails', areaDetails);