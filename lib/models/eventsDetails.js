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


var eventsDetails = new Schema(
{
	name:{ type: String, get: decrypt, set: encrypt},
	description:{ type: String, get: decrypt, set: encrypt},
	startdate:Date,
	enddate:Date,
	branch:{branchname:{type:String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
    group:{groupname:{type:String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
    areaid:{areaname:{type:String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
	createdby:String,
	ceateddate:Date,
});

eventsDetails.set('toJSON', { getters: true, setters: true ,virtuals: true});
eventsDetails.set('toObject', { getters: true, setters: true,virtuals: true });


mongoose.model('eventsDetails', eventsDetails);