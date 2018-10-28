var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var  accountTypes = require('./accountTypes');

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


var accountPlans = new Schema(
{
	name:{ type: String, get: decrypt, set: encrypt},
	description:{ type: String, get: decrypt, set: encrypt},
	frequency:{ type: String, get: decrypt, set: encrypt},
	actypeid:{accounttype:{ type: String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String},interestrate:{ type: String, get: decrypt, set: encrypt},guarantor:{ type: String, get: decrypt, set: encrypt},noguarantors:{ type: String, get: decrypt, set: encrypt},installments:{ type: String, get: decrypt, set: encrypt}},
	//actypeid:{type: mongoose.Schema.Types.ObjectId, ref: 'Friend'}
	basicamount:{ type: String, get: decrypt, set: encrypt},
	interestrate:{ type: String, get: decrypt, set: encrypt},
	netamount:{ type: String, get: decrypt, set: encrypt},
	emiamount:{ type: String, get: decrypt, set: encrypt},
	loanamount:{ type: String, get: decrypt, set: encrypt},
	tenure:{ type: String, get: decrypt, set: encrypt},
	tenuretype:{ type: String, get: decrypt, set: encrypt},
	branch:{branchname:{type:String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
    group:{groupname:{type:String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
    areaid:{areaname:{type:String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
	createdby:String,
	ceateddate:Date,
});

accountPlans.set('toJSON', { getters: true, setters: true ,virtuals: true});
accountPlans.set('toObject', { getters: true, setters: true,virtuals: true });


mongoose.model('accountPlans', accountPlans);