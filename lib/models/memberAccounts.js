var mongoose = require('mongoose');
var crypto = require('crypto');
var shortid = require('shortid');
var Schema = mongoose.Schema;
var  accountTypes = require('./accountTypes');
var  accountPlans = require('./accountPlans');
var  membersDetails = require('./membersDetails');
var  employeeDetails = require('./employeeDetails');
var  branchDetails = require('./branchDetails');





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


var memberAccounts = new Schema(
{
	//planid:{name:{ type: String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
	planid: [{ type: Schema.Types.ObjectId, ref: 'accountPlans' }],
	//accounttypeid:{accounttype:{ type: String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}},
	accounttypeid:[{ type: Schema.Types.ObjectId, ref: 'accountTypes' }],
	startingdate:Date,
	expirydate:Date,
   
  /*  memberid:{firstname:{ type: String, get: decrypt, set: encrypt},
	midname:{ type: String, get: decrypt, set: encrypt},
	lastname:{ type: String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}}, */
	
	memberid:[{ type: Schema.Types.ObjectId, ref: 'membersDetails' }],
    investedamount: { type: String, get: decrypt, set: encrypt},
    interestrate: { type: String, get: decrypt, set: encrypt},
    emi: { type: String, get: decrypt, set: encrypt},
    netamount: { type: String, get: decrypt, set: encrypt},
    loanamount: { type: String, get: decrypt, set: encrypt},
    tenure: { type: String, get: decrypt, set: encrypt},
    tenuretype: { type: String, get: decrypt, set: encrypt},
    frequency: { type: String, get: decrypt, set: encrypt},
    gourentors: [{ type: Schema.Types.ObjectId, ref: 'membersDetails' }],
    branchid: [{ type: Schema.Types.ObjectId, ref: 'branchDetails' }],
   /*  gourentor2: {firstname:{ type: String, get: decrypt, set: encrypt},
	midname:{ type: String, get: decrypt, set: encrypt},
	lastname:{ type: String, get: decrypt, set: encrypt},id:{type:String},_id:{type:String}}, */
	createdby: [{ type: Schema.Types.ObjectId, ref: 'employeeDetails' }],
	ceateddate:{type:Date,default:new Date()},
});

memberAccounts.set('toJSON', { getters: true, setters: true ,virtuals: true});
memberAccounts.set('toObject', { getters: true, setters: true,virtuals: true });


mongoose.model('memberAccounts', memberAccounts);