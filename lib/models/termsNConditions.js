var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var keystore = process.env.ENCRYPTED_KEY;

function encrypt(text) {
	if (text === null || typeof text === 'undefined') { return text; }
	else
	{
	try
	{
		var cipher = crypto.createCipher('aes-256-cbc', keystore);
		var crypted = cipher.update(text,'utf8','hex');
		crypted += cipher.final('hex');
	}
	catch(err)
	{}
	return crypted;
	}
} 

function decrypt(text) {
	if (text === null || text === 'undefined') {return text;}
	else
		{
			try
			{
					var decipher = crypto.createDecipher('aes-256-cbc', keystore);
					var dec = decipher.update(text,'hex','utf8');
					dec += decipher.final('utf8');
			}
				
			catch(err)
			{}	
			return dec;
		}
}

var descriptionpoints = new Schema(
{
	point:{ type: String, get: decrypt , set: encrypt}
});

var termsNConditions = new Schema(
{
	name:{ type: String, get: decrypt , set: encrypt},
	description:[descriptionpoints],
	approval:{ type: Number, default:0},
	createdby:String,
	ceateddate:{type:Date,default:new Date()}
});


termsNConditions.set('toObject', { getters: true, setters: true,virtuals: true });
termsNConditions.set('toJSON', { getters: true, setters: true ,virtuals: true});
descriptionpoints.set('toObject', { getters: true, setters: true,virtuals: true });
descriptionpoints.set('toJSON', { getters: true, setters: true ,virtuals: true});

mongoose.model('termsNConditions', termsNConditions);
mongoose.model('descriptionpoints', descriptionpoints);