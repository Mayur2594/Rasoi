var  cs = require('./controllers/controller');
var  security = require('./controllers/security');
const multer = require('multer');
var path = require('path');
	const dir = './app/uploads';
	
let storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, dir);
		},
		filename: (req, file, cb) => {
			cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
		}
	});
	
	let upload = multer({storage: storage});

module.exports = {

    configure: function (app) {
			app.post('/api/authUser',function (req, res) {
				cs.authUser(req.body,res);
			});
			
			app.post('/api/ResetPassword',function (req, res) {
				cs.ResetPassword(req,res);
			});
		
			app.post('/api/ForgotPassword',function (req, res) {
				cs.ForgotPassword(req.body,res);
			});
			
			app.get('/api/verifyOTP/:otp',function (req, res) {
				cs.verifyOTP(req,res);
			});
			
			
			app.post('/api/SubmitNewCompany', upload.single('file'),function (req, res) {
            cs.SubmitNewCompany(req, res);
			});
			app.post('/api/VerifyrequiredFieldsInMembers/', function (req, res) {
				security(req,res);cs.VerifyrequiredFieldsInMembers(req, res);
			});
			
			app.get('/api/getCompaniesDetails/', function (req, res) {
				security(req,res);cs.getCompaniesDetails(req, res);
			});
			
			app.get('/api/getCompanyData/:compid', function (req, res) {
				security(req,res);cs.getCompanyData(req, res);
			});
			
			app.get('/api/getUserProfile/', function (req, res) {
				security(req,res);cs.getUserProfile(req, res);
			});
		
    }
};