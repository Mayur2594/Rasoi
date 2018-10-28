var  cs = require('./controllers/cs');
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
		
		
		
		/* MEMBERS DETAILS */
			
			app.post('/api/VerifyrequiredFieldsInMembers/', function (req, res) {
				security(req,res);cs.VerifyrequiredFieldsInMembers(req, res);
			});
			
			app.post('/api/SaveMembersDetails', upload.single('file'),function (req, res) {
            security(req,res);cs.SaveMembersDetails(req, res);
			});
			
			app.get('/api/ListMembers',function (req, res) {
            security(req,res);cs.ListMembers(req, res);
			});
			
			app.post('/api/ListGuarantors/',function (req, res) {
            security(req,res);cs.ListGuarantors(req, res);
			});
			
			app.post('/api/ListAnotherGuarantor',function (req, res) {
            security(req,res);cs.ListAnotherGuarantor(req, res);
			});
			
			app.get('/api/GetMembersDetails/:memid',function (req, res) {
            security(req,res);cs.GetMembersDetails(req, res);
			});
			
			app.delete('/api/DeleteMember/:memid',function (req, res) {
            security(req,res);cs.DeleteMember(req, res);
			});
			
			
		
		/* ---------------- */
		
		/* MEMBER ACCOUNTS DETAILS */
		
			app.get('/api/getMembersAccounts/:memid',function (req, res) {
            security(req,res);cs.getMembersAccounts(req, res);
			});
			
			app.get('/api/ListMembersAccounts/',function (req, res) {
            security(req,res);cs.ListMembersAccounts(req, res);
			});
			
			app.post('/api/SaveMembersACDetails/',function (req, res) {
            security(req,res);cs.SaveMembersACDetails(req, res);
			});
			
		
		/* ---------------- */
		
		/* MEMBER COLLECTION DETAILS */
		
		
		/* ---------------- */
		
		/* EMPLOYEE DETAILS */
			
			app.get('/api/ListEmployees/', function (req, res) {
				security(req,res);cs.ListEmployees(req, res);
			});
			
			app.get('/api/getEmployeesDetails/:empid', function (req, res) {
				security(req,res);cs.getEmployeesDetails(req, res);
			});
			
			app.delete('/api/DeleteEmployeesDetails/:empid', function (req, res) {
				security(req,res);cs.DeleteEmployeesDetails(req, res);
			});
			
			app.post('/api/VerifyrequiredFields/', function (req, res) {
				security(req,res);cs.VerifyrequiredFields(req, res);
			});
			
			app.post('/api/SaveEmployeesDetails', upload.single('file'),function (req, res) {
            security(req,res);cs.SaveEmployeesDetails(req, res);
			});
			
			
		/* ---------------- */
		
		/* AGENTS DETAILS */
		
		
		/* ---------------- */
		
		/* AGENTS COLLECTION LIMIT DETAILS */
		
		
		/* ---------------- */
		
		/* BRANCH DETAILS */
			
			app.post('/api/SaveBranchDetails/', function (req, res) {
				security(req,res);cs.SaveBranchDetails(req, res);
			});
			app.get('/api/ListBranchs/', function (req, res) {
				security(req,res);cs.ListBranchs(req, res);
			});
			app.get('/api/getBranchDetails/:branchid', function (req, res) {
				security(req,res);cs.getBranchDetails(req, res);
			});
			app.delete('/api/DeleteBranch/:branchid', function (req, res) {
				security(req,res);cs.DeleteBranch(req, res);
			});
		
		/* ---------------- */
		
		/* AREA DETAILS */
		
			app.post('/api/SaveAreaDetails/', function (req, res) {
				security(req,res);cs.SaveAreaDetails(req, res);
			});
			app.get('/api/ListAreas/', function (req, res) {
				security(req,res);cs.ListAreas(req, res);
			});
			app.get('/api/getAreaDetails/:areaid', function (req, res) {
				security(req,res);cs.getAreaDetails(req, res);
			});
			app.delete('/api/DeleteArea/:areaid', function (req, res) {
				security(req,res);cs.DeleteArea(req, res);
			});
		/* ---------------- */
		
		/* GROUP DETAILS */
			app.post('/api/SavegroupDetails/', function (req, res) {
				security(req,res);cs.SavegroupDetails(req, res);
			});
			app.get('/api/ListGroups/', function (req, res) {
				security(req,res);cs.ListGroups(req, res);
			});
			app.get('/api/getGroupDetails/:groupid', function (req, res) {
				security(req,res);cs.getGroupDetails(req, res);
			});
			app.delete('/api/DeleteGroup/:groupid', function (req, res) {
				security(req,res);cs.DeleteGroup(req, res);
			});
		
		/* ---------------- */
		
		/* EVENTS DETAILS */
			app.post('/api/SaveEventsDetails/', function (req, res) {
				security(req,res);cs.SaveEventsDetails(req, res);
			});
			app.get('/api/ListEvents/', function (req, res) {
				security(req,res);cs.ListEvents(req, res);
			});
			app.get('/api/getEventDetails/:eventid', function (req, res) {
				security(req,res);cs.getEventDetails(req, res);
			});
			app.delete('/api/DeleteEvent/:eventid', function (req, res) {
				security(req,res);cs.DeleteEvent(req, res);
			});
		
		/* ---------------- */
		
		/* TERMS & CONDITIONS DETAILS */
		app.post('/api/SaveTermsDetails/', function (req, res) {
            security(req,res);cs.SaveTermsDetails(req, res);
        });
		app.get('/api/ListTermsNCondtions/', function (req, res) {
            security(req,res);cs.ListTermsNCondtions(req, res);
        });
		app.get('/api/getTermsDetails/:termid', function (req, res) {
            security(req,res);cs.getTermsDetails(req, res);
        });
		app.delete('/api/DeleteTermCondition/:termid', function (req, res) {
            security(req,res);cs.DeleteTermCondition(req, res);
        });
		app.delete('/api/RemoveTermDescriptionPoint/:termdetailsid/:termmasterid', function (req, res) {
            security(req,res);cs.RemoveTermDescriptionPoint(req, res);
        });
		/* ---------------- */
		
		/* ACCOUNT TYPES DETAILS */
		
			app.post('/api/SaveaccountTypes/', function (req, res) {
				security(req,res);cs.SaveaccountTypes(req, res);
			});
			app.get('/api/ListAccounttypes/', function (req, res) {
				security(req,res);cs.ListAccounttypes(req, res);
			});
			app.get('/api/getAccounttypesDetails/:acTypesid', function (req, res) {
				security(req,res);cs.getAccounttypesDetails(req, res);
			});
			app.delete('/api/DeleteACTypeDetails/:acTypesid', function (req, res) {
				security(req,res);cs.DeleteACTypeDetails(req, res);
			});
		
		/* ---------------- */
		
		/* ACCOUNT PLANS DETAILS */
			app.post('/api/SaveAccountPlan/', function (req, res) {
				security(req,res);cs.SaveAccountPlan(req, res);
			});
			app.get('/api/ListaccountPlans/', function (req, res) {
				security(req,res);cs.ListaccountPlans(req, res);
			});
			app.get('/api/getAccountPlansDetails/:acPlanid', function (req, res) {
				security(req,res);cs.getAccountPlansDetails(req, res);
			});
			app.delete('/api/DeleteACPlanDetails/:acPlanid', function (req, res) {
				security(req,res);cs.DeleteACPlanDetails(req, res);
			});
		
		
		/* ---------------- */
		
		/* REFERANCES */
		app.get('/api/ListBranchsforReferance/', function (req, res) {
            security(req,res);cs.ListBranchsforReferance(req, res);
        });
		app.get('/api/ListAcTypesRef/', function (req, res) {
            security(req,res);cs.ListAcTypesRef(req, res);
        });
		app.get('/api/ListAreasOnBranch/:branchid', function (req, res) {
           security(req,res);cs.ListAreasOnBranch(req, res);
        });
		app.get('/api/ListGroupsOnArea/:areaid', function (req, res) {
            security(req,res);cs.ListGroupsOnArea(req, res);
        });
		
		
		app.get('/api/getUserProfile/', function (req, res) {
            security(req,res);cs.getUserProfile(req, res);
        });
		
		
		/* ----------- */
		
        
		
		
		
		
    }
};