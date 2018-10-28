var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt    = require('jsonwebtoken');
var express = require('express');

var  membersDetails = require('../models/membersDetails');
var  memberAccounts = require('../models/memberAccounts');
var  accountTypes = require('../models/accountTypes');
var  agentDetails = require('../models/agentDetails');
var  areaDetails = require('../models/areaDetails');
var  branchDetails = require('../models/branchDetails');
var  employeeDetails = require('../models/employeeDetails');
var  accountPlans = require('../models/accountPlans');
var  collectionDetails = require('../models/collectionDetails');
var  collectionLimit = require('../models/collectionLimit');
var  eventsDetails = require('../models/eventsDetails');
var  groupDetails = require('../models/groupDetails');
var  termsNConditions = require('../models/termsNConditions');

var members = mongoose.model('membersDetails');
var membersacc = mongoose.model('memberAccounts');
var actypes = mongoose.model('accountTypes');
var agents = mongoose.model('agentDetails');
var areas = mongoose.model('areaDetails');
var branches = mongoose.model('branchDetails');
var employees = mongoose.model('employeeDetails');
var acplans = mongoose.model('accountPlans');
var collections = mongoose.model('collectionDetails');
var collectionlimit = mongoose.model('collectionLimit');
var events = mongoose.model('eventsDetails');
var groups = mongoose.model('groupDetails');
var termsnconditions = mongoose.model('termsNConditions');
var descriptionpoints = mongoose.model('descriptionpoints');



//var loaded = joins.installPlugins(mongoose);
const puretext = require('puretext');
  
var app = express();

app.set('superSecret', process.env.JWT_SECRATE); // secret variable

mongoose.set('useCreateIndex', true);
	
var opts = {
    //useMongoClient: true,
    autoReconnect: true,
	autoIndex: false, // Don't build indexes
    //reconnectTries: 100, // Never stop trying to reconnect /* Not used for replica set */
    //reconnectInterval: 500, // Reconnect every 500ms  /* Not used for replica set */
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    /*bufferMaxEntries: 0*/
	connectTimeoutMS: 30000,
	socketTimeoutMS: 30000,
	useNewUrlParser: true	
  };

  function encrypt(text) {
	try
	{
		if (text === null || typeof text === 'undefined') { return text; };
		var cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTED_KEY);
		var crypted = cipher.update(text,'utf8','hex');
		crypted += cipher.final('hex');
	}
	catch(err)
	{
		console.log(err)
	}
	return crypted;
} 

	var verificationObject = [{}];
		
		function getvaluesinObject(passedval)
		{
			var charindex = passedval.indexOf("=");
			var strindex = passedval.length;
			var field = passedval.substring(0,charindex).trim();
			var value = passedval.substring(charindex + 1,strindex);
			
			verificationObject[0][field] = value.trim();
			
			
		};
		
  

	/* USER AUTHENTICATION */
	
	exports.authUser= function(userdetails, res) {
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			employees.find({'username':userdetails.username,'password':userdetails.password},{'username':1,'profilepic':1,'role':1,'branch':1}).exec(function (err, result) {
				if(err)
				{
					res.send({success:false,message:'Somthing went wrong, Please try again.'});
					mongoose.disconnect();
				}
				else
				{
					if(result.length > 1 || result.length <= 0)
					{
						res.json({success:false,message:'Login cridentials does not matched.'});
					}
					if(result.length == 1)
					{
								var payload = {
									userid: result[0]._id	
								}
								var token = jwt.sign(payload, app.get('superSecret'), {
									expiresIn: 28800 // expires in 24 hours = 86400
								});
							
									var d = new Date();
									d.setTime(d.getTime() + (0.7*24*60*60*1000));
									var expires = d.toUTCString();
								  
									res.cookie('token', token, { expires: new Date(expires), httpOnly: true });
									res.cookie('username', result[0].username, { expires: new Date(expires), httpOnly: true });
									res.cookie('id', result[0].id, { expires: new Date(expires), httpOnly: true });
									res.cookie('role', result[0].role, { expires: new Date(expires), httpOnly: true });
									res.cookie('branchid', result[0].branch.id, { expires: new Date(expires), httpOnly: true });
									res.cookie('profilepic', result[0].profilepic, { expires: new Date(expires), httpOnly: true });
									
									res.send({success:true,message:'logged in successfully.'});
					}
					
					mongoose.disconnect();
				}
			});
		});
	};   
	
	exports.ForgotPassword = function(userdetails, res) {
		
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
					employees.find({'username':userdetails.username,'contactdetails.email':userdetails.email},{'username':1,'contactdetails.mobile1':1}).exec(function (err, result) {
						
				if(err)
				{
					res.send({success:false,message:'Somthing went wrong, Please try again.'});
					mongoose.disconnect();
				}
				else
				{
					if(result.length > 1 || result.length <= 0)
					{
						res.json({success:false,message:'Details does not matched.'});
					}
					if(result.length == 1)
					{
							 		var d = new Date();
									d.setTime(d.getTime() + (0.1*24*60*60*1000));
									var expires = d.toUTCString();
									
									var otp = Math.floor(100000 + Math.random() * 900000);
									var sentotp =  encrypt(String(otp));
									var userid = String(result[0]._id);
									res.cookie('otp',sentotp, { expires: new Date(expires), httpOnly: true });
									res.cookie('_id',userid, { expires: new Date(expires), httpOnly: true });
									
					let text = {
					  // To Number is the number you will be sending the text to.
					  toNumber: '+91'+result[0].contactdetails.mobile1,
					  // From number is the number you will buy from your admin dashboard
					  fromNumber: '+14157992515',
					  // Text Content
					  smsBody: 'Your OTP is '+otp+'. \n Please enter it for reset your password for CS portal.\n This OTP is valid for 10 minuts. \n Thanks, \n Admin \n (CS Pvt. Ltd.)',
					  //Sign up for an account to get an API Token
					  //apiToken: '6ampbh'  registered token
					  apiToken: 'testaccount'
				  };
				  
				  puretext.send(text, function (err, response) {
					if(err) console.log(err);
					else {
							res.send({success:true,message:'OTP sent to your registered mobile number.'});
						}
				  });  
				}
				}
			});
		});
		
	};   
	
	exports.verifyOTP= function(req, res) {
		var cookies = req.headers.cookie.split(';', 5);
		cookies.map(function(value){ getvaluesinObject(value)});
		
		var recievedotp = encrypt(String(req.params.otp))
		if(recievedotp === verificationObject[0].otp)
		{
			res.clearCookie('otp', { path: '/' });
			res.send({status:0});
		}
		else
		{
			res.send({status:1});
		}
	};   
	
	
	exports.ResetPassword= function(req, res) {
		if(req.headers.cookie)
		{
		var cookies = req.headers.cookie.split(';', 5);
		cookies.map(function(value){ getvaluesinObject(value)});
		if(verificationObject[0]._id)
		{
			mongoose.connect(process.env.MONGOLAB_URI,opts).then(
			()=>{
				employees.updateOne({_id:verificationObject[0]._id},{$set: { 'password': req.body.password}}).exec(function (err, result) {
					console.log(err);
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Password updated successfully, Thank you!'});
						mongoose.disconnect();
					}
				});
			});
			}
			else
		{
			res.send({status:1,message:'Somthing went wrong, Please generate OTP again'});
		}
		}
		else
		{
			res.send({status:1,message:'Somthing went wrong, Please generate OTP again'});
		}
	};   
	
	
	/* TERMS AND CONDITIONS */
	
	
	
	
	
	exports.ListTermsNCondtions= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			termsnconditions.find({}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.DeleteTermCondition= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var termid = req.params.termid;
			termsnconditions.deleteOne({_id:termid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record deleted successfully!'});
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.getTermsDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var termid = req.params.termid;
			termsnconditions.find({_id:termid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.SaveTermsDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		var tearmsDetails = req.body;
		var description = tearmsDetails.description ;
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var tearmsdetails = new termsnconditions(tearmsDetails);
			if(tearmsDetails._id)
			{
				termsnconditions.update({ _id: tearmsDetails._id }, tearmsDetails,{ multi: true }, function(err) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record updated successfully!'});
					mongoose.disconnect();
				}
			});
			}
			else
			{
				tearmsdetails.save(function(err,result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record inserted successfully!'});
						mongoose.disconnect();
					}
				});
			}
		});
		}
	};   
	

	
	exports.RemoveTermDescriptionPoint= function(req, res) {
		if(req.decoded.success == true)
		{
		var tearmsDetailsid = req.params.termdetailsid;
		var termmasterid = req.params.termmasterid;
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			termsnconditions.update( 
				{ _id: termmasterid },
				{ $pull: { description : { _id : tearmsDetailsid } } },
				{ safe: true },
				function removeConnectionsCB(err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record deleted successfully!'});
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	/* TERMS AND CONDITIONS */
	
	/* BRANCH DETAILS */
	
		exports.ListBranchs= function(req, res) {
			if(req.decoded.success == true)
		{
			mongoose.connect(process.env.MONGOLAB_URI,opts).then(
			()=>{
				branches.find({}).exec(function (err, result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send(result);
						mongoose.disconnect();
					}
				});
			});
		}
	};   
	
	
	exports.getBranchDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var branchid =  req.params.branchid
			branches.find({_id:branchid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.DeleteBranch= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			   var branchid =  req.params.branchid
			branches.deleteOne({_id:branchid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record deleted successfully!'});
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
		
	exports.SaveBranchDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var branchDetails = req.body;
			branchDetails.createdby = req.Loggedinuser.id;
			
			var branchdetails = new branches(branchDetails);
			if(branchDetails._id)
			{
				branches.update({ _id: branchDetails._id }, branchDetails,{ multi: true }, function(err) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record updated successfully!'});
					mongoose.disconnect();
				}
			});
			}
			else
			{
				branchdetails.save(function(err,result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record inserted successfully!'});
						mongoose.disconnect();
					}
				});
			}
		});
		}
	};   
	
	
	/* BRANCH DETAILS */

	
	
	/* AREA DETAILS */
	
		exports.ListAreas= function(req, res) {
			if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			   areas.find({}).exec(function (err, result) { 
						console.log(err);
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			}); 
			
		});
		}
	};   
	
	
	exports.getAreaDetails= function(areaid, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var areaid = req.params.areaid;
			areas.find({_id:areaid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.DeleteArea= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var areaid = req.params.areaid;
			areas.deleteOne({_id:areaid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record deleted successfully!'});
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
		
	exports.SaveAreaDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			
			var AreaDetails = req.body
			
			var areasdetails = new areas(AreaDetails);
			if(AreaDetails._id)
			{
				areas.update({ _id: AreaDetails._id }, AreaDetails,{ multi: true }, function(err) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record updated successfully!'});
					mongoose.disconnect();
				}
			});
			}
			else
			{
				areasdetails.save(function(err,result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record inserted successfully!'});
						mongoose.disconnect();
					}
				});
			}
		});
		}
	};   
	
	
	/* AREA DETAILS */
	
	
	/* GROUP DETAILS */
	
		exports.ListGroups= function(req, res) {
			if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			 groups.find({}).exec(function (err, result) { 
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
	exports.getGroupDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var groupid = req.params.groupid
			groups.find({_id:groupid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send([result]);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.DeleteGroup= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			
			var groupid = req.params.groupid
			
			groups.deleteOne({_id:groupid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record deleted successfully!'});
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
		
	exports.SavegroupDetails = function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			   var groupDetails = req.body;
			var groupsdetails = new groups(groupDetails);
			if(groupDetails._id)
			{
				groups.update({ _id: groupDetails._id }, groupDetails,{ multi: true }, function(err) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record updated successfully!'});
					mongoose.disconnect();
				}
			});
			}
			else
			{
				groupsdetails.save(function(err,result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record inserted successfully!'});
						mongoose.disconnect();
					}
				});
			}
		});
		}
	};   
	
	
	/* GROUP DETAILS */
	
	
	/* EVENTS DETAILS */
	
		exports.ListEvents= function(req, res) {
			if(req.decoded.success == true)
		{
			mongoose.connect(process.env.MONGOLAB_URI,opts).then(
			()=>{
				 events.find({}).exec(function (err, result) { 
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send(result);
						mongoose.disconnect();
					}
				});
			});
		}
	};   
	
	
	exports.getEventDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			
				var eventid = req.params.eventid;
			
			events.find({_id:eventid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.DeleteEvent= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			
			var eventid = req.params.eventid;
			
			events.deleteOne({_id:eventid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record deleted successfully!'});
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
		
	exports.SaveEventsDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var eventDetails = req.body;
			var eventsdetails = new events(eventDetails);
			if(eventDetails._id)
			{
				events.update({ _id: eventDetails._id }, eventDetails,{ multi: true }, function(err) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record updated successfully!'});
					mongoose.disconnect();
				}
			});
			}
			else
			{
				eventsdetails.save(function(err,result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record inserted successfully!'});
						mongoose.disconnect();
					}
				});
			}
		});
		}
	};   
	
	
	/* EVENTS DETAILS */
	
	
	/* ACCOUNT TYPES */
	
		exports.ListAccounttypes= function(req, res) {
			if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			 actypes.find({}).exec(function (err, result) { 
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
	exports.getAccounttypesDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var acTypeid = req.params.acTypesid;
			
			actypes.find({_id:acTypeid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.DeleteACTypeDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var acTypeid = req.params.acTypesid;
			
			actypes.deleteOne({_id:acTypeid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record deleted successfully!'});
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
		
	exports.SaveaccountTypes= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var ACTypesDetails = req.body;
			var acTypesdetails = new actypes(ACTypesDetails);
			if(ACTypesDetails._id)
			{
				actypes.update({ _id: ACTypesDetails._id }, ACTypesDetails,{ multi: true }, function(err) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record updated successfully!'});
					mongoose.disconnect();
				}
			});
			}
			else
			{
				acTypesdetails.save(function(err,result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record inserted successfully!'});
						mongoose.disconnect();
					}
				});
			}
		});
		}
	};   
	
	
	/* ACCOUNT TYPES  */
	
	
	/* ACCOUNT PLANS */
	
		exports.ListaccountPlans= function(req, res) {
			if(req.decoded.success == true)
			{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			   acplans.find({}).exec(function (err, result) { 
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});  
			});  
		
			}
	};   
	
	
	exports.getAccountPlansDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var acPlanid = req.params.acPlanid;
			acplans.find({_id:acPlanid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.DeleteACPlanDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var acPlanid = req.params.acPlanid;
			acplans.deleteOne({_id:acPlanid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record deleted successfully!'});
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
		
	exports.SaveAccountPlan= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var ACPlansDetails = req.body;
			var acPlansdetails = new acplans(ACPlansDetails);
			if(ACPlansDetails._id)
			{
				acplans.update({ _id: ACPlansDetails._id }, req.body,{ multi: true }, function(err) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record updated successfully!'});
					mongoose.disconnect();
				}
			});
			}
			else
			{
				acPlansdetails.save(function(err,result) {
					console.log(err)
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record inserted successfully!'});
						mongoose.disconnect();
					}
				});
			}
		});
		}
	};	
	
	/* ACCOUNT PLANS  */
	
	
	/* EMPLOYEE DETAILS */
	  
	exports.ListEmployees= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			
			if(req.Loggedinuser.role == 'Superadmin')
				var filterqry ={}
			if(req.Loggedinuser.role == 'Admin' || req.Loggedinuser.role == 'User')
				var filterqry ={'branch.id':req.Loggedinuser.branchid}
			employees.find(filterqry,{'firstname':1,'lastname':1,'midname':1,'gander':1,'doj':1,'role':1,'branch':1,'contactdetails':1}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
	exports.getEmployeesDetails= function(req, res) {
		if(req.decoded.success == true)
		{
			mongoose.connect(process.env.MONGOLAB_URI,opts).then(
			()=>{
				var empid = req.params.empid;
				
				employees.find({_id:empid}).exec(function (err, result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send(result);
						mongoose.disconnect();
					}
				});
			});
		}
	};   
	
	exports.DeleteEmployeesDetails= function(req, res) {
		if(req.decoded.success == true)
		{
			mongoose.connect(process.env.MONGOLAB_URI,opts).then(
			()=>{
				var empid = req.params.empid;
				
				employees.deleteOne({_id:empid}).exec(function (err, result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record deleted successfully.'});
						mongoose.disconnect();
					}
				});
			});
		}
	};   
	
	exports.VerifyrequiredFields= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var data = req.body;
			var verificationfield =  data.verification;
			
			if(data.field == 'Mobile')
			{	
				if(data.userid)
					var filterqry = employees.countDocuments({'contactdetails.mobile1':verificationfield,_id: { $ne: data.userid }}) 
				else
				var filterqry = employees.countDocuments({'contactdetails.mobile1':verificationfield}) 
			}
			if(data.field == 'Email')
			{	
				if(data.userid)
				var filterqry = employees.countDocuments({'contactdetails.email':verificationfield,_id: { $ne: data.userid }})
				else
				var filterqry = employees.countDocuments({'contactdetails.email':verificationfield})
			}
			if(data.field == 'Username')
			{
				if(data.userid)
				var filterqry = employees.countDocuments({'username':verificationfield,_id: { $ne: data.userid }})
				else
				var filterqry = employees.countDocuments({'username':verificationfield})
			}
			filterqry.exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					if(result > 0)
					{
						res.send({status:1,message:data.field+' already exist in the system'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:''});
						mongoose.disconnect();
					}
				}
			}); 
		});
		}
	}; 
	
		
	exports.SaveEmployeesDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var employeepic = req.file;
			var empdet = req.body;
			empdet.employeedetails.createdby = req.Loggedinuser.id
			if(employeepic)
			{
				empdet.employeedetails.documentsdetails.pic = employeepic.filename;
			}
			 var empDetails = new employees(empdet.employeedetails);
			if(empdet.employeedetails._id)
			{
				employees.updateOne({ _id: empdet.employeedetails._id }, empdet.employeedetails,{ multi: true }, function(err) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record updated successfully!'});
					mongoose.disconnect();
				}
			});
			}
			else
			{
				empDetails.save(function(err,result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record inserted successfully!'});
						mongoose.disconnect();
					}
				});
			} 
		});
		}
	};   
	
	
	/* EMPLOYEE DETAILS */

	/* MEMBERS DETAILS */
		
			
	exports.VerifyrequiredFieldsInMembers= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var data = req.body;
			var verificationfield =  data.verification;
			
			if(data.field == 'Mobile')
			{	
				if(data.memberid)
					var filterqry = members.countDocuments({'contactdetails.mobile1':verificationfield,_id: { $ne: data.memberid }}) 
				else
				var filterqry = members.countDocuments({'contactdetails.mobile1':verificationfield}) 
			}
			if(data.field == 'Email')
			{	
				if(data.memberid)
				var filterqry = members.countDocuments({'contactdetails.email':verificationfield,_id: { $ne: data.memberid }})
				else
				var filterqry = members.countDocuments({'contactdetails.email':verificationfield})
			}
			if(data.field == 'Aadhaar card No')
			{
				if(data.memberid)
				var filterqry = members.countDocuments({'documentsdetails.aadhaar':verificationfield,_id: { $ne: data.memberid }})
				else
				var filterqry = members.countDocuments({'documentsdetails.aadhaar':verificationfield})
			}
			
			if(data.field == 'Pan No')
			{
				if(data.memberid)
				var filterqry = members.countDocuments({'documentsdetails.pan':verificationfield,_id: { $ne: data.memberid }})
				else
				var filterqry = members.countDocuments({'documentsdetails.pan':verificationfield})
			}
			filterqry.exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					if(result > 0)
					{
						res.send({status:1,message:data.field+' already exist in the system'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:''});
						mongoose.disconnect();
					}
				}
			}); 
		});
		}
	};   
	
	
	exports.SaveMembersDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var memberpic = req.file;
			var memdet = req.body;
			memdet.membersDetails.createdby = req.Loggedinuser.id
			if(memberpic)
			{
				memdet.membersDetails.documentsdetails.pic = memberpic.filename;
			}
			 var memberDetails = new members(memdet.membersDetails);
			if(memdet.membersDetails._id)
			{
				members.updateOne({ _id: memdet.membersDetails._id }, memdet.membersDetails,{ multi: true }, function(err) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record updated successfully!'});
					mongoose.disconnect();
				}
			});
			}
			if(!memdet.membersDetails._id)
			{
				memberDetails.save(function(err,result) {
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record inserted successfully!'});
						mongoose.disconnect();
					}
				});
			} 
		});
		}
	};   
	
	exports.ListMembers= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			
			if(req.Loggedinuser.role == 'Superadmin')
				var filterqry ={}
			if(req.Loggedinuser.role == 'Admin' || req.Loggedinuser.role == 'User')
				var filterqry ={'branch.id':req.Loggedinuser.branchid}
			members.find(filterqry,{'firstname':1,'lastname':1,'midname':1,'depositeamount':1,'documentsdetails.aadhaar':1,'contactdetails.mobile1':1,'branch.branchname':1}).exec(function (err, result) {
				console.log(err)
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
	exports.ListGuarantors= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var selectedmemberdetails = req.body;
			
				var filterqry = {'branch.id':selectedmemberdetails.branch._id,'_id': { $ne: selectedmemberdetails._id },'depositeamount': { $eq: selectedmemberdetails.depositeamount }};
			
			members.find(filterqry,{'firstname':1,'lastname':1,'midname':1,'depositeamount':1,'group.groupname':1,'areaid.areaname':1,'branch.branchname':1}).exec(function (err, result) {
				console.log(err)
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
	exports.ListAnotherGuarantor= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
					var guadetails = req.body.guarantors;
					var membersdetails = req.body.memberdetails;
					
								var selectedmembersid = [membersdetails._id];
					
						guadetails.map(function(value)
						{
							if(value.gaumembername && value.gaumembername._id)
							selectedmembersid.push(value.gaumembername._id)
						})
						
				 var filterqry = {'branch.id':membersdetails.branch._id,'_id': { $nin: selectedmembersid },'depositeamount': { $eq: membersdetails.depositeamount }};
				 
			members.find(filterqry,{'firstname':1,'lastname':1,'midname':1,'depositeamount':1,'group.groupname':1,'areaid.areaname':1,'branch.branchname':1}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			}); 
		});
		}
	};   
	
	
	exports.GetMembersDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var memberid = req.params.memid;
			
			members.find({_id:memberid}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
	exports.DeleteMember= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var memberid = req.params.memid;
			
			members.deleteOne({_id:memberid}).exec(function (err, result) {
				console.log(err)
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record deleted successfully'});
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	/* MEMBERS DETAILS */
	
	
	/* MEMBER`S ACCOUNTS DETAILS */
	
	
	
	exports.getMembersAccounts= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var memberid = req.params.memid;
			
			membersacc.find({'memberid':memberid},{'interestrate':1,'loanamount':1,'netamount':1}).populate('accounttypeid','accounttype').exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
	exports.ListMembersAccounts= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			
			
				if(req.Loggedinuser.role == 'Superadmin')
				var filterqry ={}
				if(req.Loggedinuser.role == 'Admin' || req.Loggedinuser.role == 'User')
				var filterqry ={'branchid':req.Loggedinuser.branchid}
			
			membersacc.find(filterqry,{'interestrate':1,'loanamount':1,'netamount':1}).populate('accounttypeid','accounttype').populate('memberid').populate('branchid','branchname').populate('planid','name').exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
	
	
	exports.SaveMembersACDetails= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var membersaccountdDetails = req.body;
			
			membersaccountdDetails.memberid = req.body._id;
			membersaccountdDetails.branchid = req.body.branch._id;
			
		
			if(membersaccountdDetails.gourentorsdetails)
			{
					membersaccountdDetails.gourentors = [];
				
			membersaccountdDetails.gourentorsdetails.map(function(value){
				
				membersaccountdDetails.gourentors.push(value.gaumembername._id)
				
			})
			}
			
			membersaccountdDetails.createdby = req.Loggedinuser.id
			
			delete membersaccountdDetails._id;
			delete membersaccountdDetails.id;
			
			var membersACDetails = new membersacc(membersaccountdDetails);
			/* if(ACPlansDetails._id)
			{
				membersacc.update({ _id: ACPlansDetails._id }, req.body,{ multi: true }, function(err) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send({status:0,message:'Record updated successfully!'});
					mongoose.disconnect();
				}
			});
			}
			else
			{ */
				membersACDetails.save(function(err,result) {
					console.log(err)
					if(err)
					{
						res.send({status:1,message:'Somthing went wrong, Please try again!'});
						mongoose.disconnect();
					}
					else
					{
						res.send({status:0,message:'Record inserted successfully!'});
						mongoose.disconnect();
					}
				});
			/* } */
		}); 
		}
	};   
	
	
	
	
	
	/* MEMBER`S ACCOUNTS DETAILS */
	
	
	/* REFERANCES */
	exports.ListBranchsforReferance= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			branches.find({},{'branchname':1}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.ListAreasOnBranch= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var branchid = req.params.branchid;
			
			areas.find({'branchid._id':branchid},{'areaname':1}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	exports.ListGroupsOnArea= function(req, res) {
		if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var areaid = req.params.areaid;
			groups.find({'areaid._id':areaid},{'groupname':1}).exec(function (err, result) {
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
		
		exports.ListAcTypesRef= function(req, res) {
			if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			 actypes.find({},{'accounttype':1,'installments':1,'guarantor':1,'interestrate':1,'noguarantors':1}).exec(function (err, result) { 
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	
	exports.getUserProfile= function(req, res) {
			if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			 employees.find({_id:req.Loggedinuser.id}).exec(function (err, result) { 
				if(err)
				{
					res.send({status:1,message:'Somthing went wrong, Please try again!'});
					mongoose.disconnect();
				}
				else
				{
					res.send(result);
					mongoose.disconnect();
				}
			});
		});
		}
	};   
	
	/* REFERANCES */
