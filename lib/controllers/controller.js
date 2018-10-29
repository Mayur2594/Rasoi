var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt    = require('jsonwebtoken');
var express = require('express');


var  AllModels = require('../models/AllModels');

var members = mongoose.model('membersDetails');
var agents = mongoose.model('agentDetails');
var termsnconditions = mongoose.model('termsNConditions');

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
			console.log(userdetails);
			agents.find({'users.mobile':userdetails.mobile,'users.password':userdetails.password},{'users.firstname':1,'users.lastname':1,'users.profilpic':1,'users.role':1,'users._id':1,'users.address':1,'users.password':1,'users.mobile':1}).exec(function (err, result) {
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
							
							var authenticateduser = [];
							
								result[0].users.map(function(value){
											if(value.mobile === userdetails.mobile && value.password === userdetails.password)
											{
												authenticateduser.push(value);
											}
									});
				
									console.log(authenticateduser);
									
									var payload = {
									userid: authenticateduser[0]._id	
								}
									
								 var token = jwt.sign(payload, app.get('superSecret'), {
									expiresIn: 28800 // expires in 24 hours = 86400
								});
							
									var d = new Date();
									d.setTime(d.getTime() + (0.7*24*60*60*1000));
									var expires = d.toUTCString();
								  
									res.cookie('token', token, { expires: new Date(expires), httpOnly: true });
									res.cookie('username', String(authenticateduser[0].firstname+' '+authenticateduser[0].lastname), { expires: new Date(expires), httpOnly: true });
									res.cookie('id', String(authenticateduser[0]._id), { expires: new Date(expires), httpOnly: true });
									res.cookie('role', authenticateduser[0].role, { expires: new Date(expires), httpOnly: true });
									res.cookie('profilepic', authenticateduser[0].profilpic, { expires: new Date(expires), httpOnly: true });
									
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
	


	
	
	exports.SubmitNewCompany= function(req, res) {
		
			mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			var companypic = req.file;
			var companydetails = req.body;
			if(companypic)
			{
				companydetails.companydetails.companypic = companypic.filename;
			}
			 var NewCompany = new agents(companydetails.companydetails);
			  for(var i = 0;i < NewCompany.users.length;i++)
				  {
				  NewCompany.users[i].address.push(NewCompany.address[0]._id);
				}
			 
			 if(companydetails.companydetails._id)
			{
				agents.updateOne({ _id: companydetails.companydetails._id }, companydetails.companydetails,{ multi: true }, function(err) {
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
			if(!companydetails.companydetails._id)
			{
				NewCompany.save(function(err,result) {
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
	
	
	exports.getCompaniesDetails= function(req, res) {
			if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			 agents.find({},{'firmname':1,'ownerdetails.firstname':1,'ownerdetails.midname':1,'ownerdetails.lastname':1,'contactdetails.mobile1':1,'contactdetails.mobile2':1,'users':1}).exec(function (err, result) { 
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
	
	
	exports.getCompanyData= function(req, res) {
			if(req.decoded.success == true)
		{
		mongoose.connect(process.env.MONGOLAB_URI,opts).then(
		()=>{
			 agents.find({_id:req.params.compid}).exec(function (err, result) { 
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
