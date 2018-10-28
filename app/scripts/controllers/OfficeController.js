angular.module('CSApp')
.controller('OfficeController',function ($scope,$http,$route,$location,$window) {
	
	var userid = $window.localStorage["userid"];
	
		$scope.checkcurrpage=function(myValue){
			
			if(myValue == null || myValue == 0)
				myValue = 1;
			
		if(!myValue){
		 window.document.getElementById("mypagevalue").value = $scope.currentPage+1;
		 var element = window.document.getElementById("mypagevalue");
		 if(element)
			 element.focus();
		$scope.currentPage = $scope.currentPage;
		$scope.myValue = null;
		}
		
		else{
			$scope.dispval = "";
			if(myValue-1 <= 0){
				$scope.currentPage=0;
			}
			else{
				$scope.currentPage=myValue-1;
				
				if(!$scope.currentPage){$scope.currentPage=0;}
			}
		}};
			
			$scope.pagination = function(listdata)
			{
					$scope.recordsdisplay = [{value:10,name:10},{value:25,name:25},{value:50,name:50},{value:100,name:100},{value:listdata.length,name:'All'}]
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > listdata.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
						return Math.ceil(listdata.length / $scope.pageSize);
					};
			};
	
	
	/* BRANCH DETAILS--- */
	
		$scope.ListBranchs = function()
		{
			$http({
              method: 'GET'
              , url: '/api/ListBranchs/'
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.branchList = response.data;
			$(".loader").fadeOut("slow");
			$scope.pagination($scope.branchList);
		});
		};
		
		
		$scope.getBranchDetails = function(branchid)
		{
			$http({
              method: 'GET'
              , url: '/api/getBranchDetails/'+branchid
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.branchDetails = response.data;
		});
		};
		
		
		$scope.DeleteBranch = function(branchid)
	{
		var yes = confirm('Are yuo sure? \n Record will never get you back after delete it')
				if(yes)
				{
					$http({
						  method: 'DELETE'
						  , url: '/api/DeleteBranch/'+branchid
						  , dataType: 'jsonp'
						}).then(function (response) {
						alert(response.data.message);
						$scope.ListBranchs();
					});
				}
	}
		
		$scope.SaveBranchDetails = function()
		{
		$http({
			method  : 'POST',
			url     : '/api/SaveBranchDetails/',
			data    : $scope.branchDetails[0] ,
			headers : {'Content-Type': 'application/json'} 
		}).then(function(response) {
			alert(response.data.message);
			$scope.branchDetails =[];
			$scope.ListBranchs();
		});
		};
	
	/* ---BRANCH DETAILS */
	
	
	/* ACCOUNT TYPES--- */
	
		$scope.ListAccounttypes = function()
		{
			$http({
              method: 'GET'
              , url: '/api/ListAccounttypes/'
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.ACTypesList = response.data;
			$(".loader").fadeOut("slow");
			$scope.pagination($scope.ACTypesList);
		});
		};
		
		
		$scope.getAccounttypesDetails = function(actypeid)
		{
			$http({
              method: 'GET'
              , url: '/api/getAccounttypesDetails/'+actypeid
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.accountTypes = response.data;
			if($scope.memberAccounts)
			{
				if($scope.memberAccounts.planid)
				{
					
				}
				else
				{
					$scope.memberAccounts.interestrate = $scope.accountTypes[0].interestrate;
				}
			}
		});
		};
		
		
		$scope.DeleteACTypeDetails = function(actypeid)
	{
		var yes = confirm('Are yuo sure? \n Record will never get you back after delete it')
				if(yes)
				{
					$http({
						  method: 'DELETE'
						  , url: '/api/DeleteACTypeDetails/'+actypeid
						  , dataType: 'jsonp'
						}).then(function (response) {
						alert(response.data.message);
						$scope.ListAccounttypes();
					});
				}
	}
		
		$scope.SaveaccountTypes = function()
		{
			$scope.accountTypes[0].createdby = userid
		$http({
			method  : 'POST',
			url     : '/api/SaveaccountTypes/',
			data    : $scope.accountTypes[0] ,
			headers : {'Content-Type': 'application/json'} 
		}).then(function(response) {
			alert(response.data.message);
			$scope.accountTypes =[];
			$scope.ListAccounttypes();
		});
		};
	
	/* ---ACCOUNT TYPES */

	
	/* ACCOUNT PLANS--- */
	
		$scope.ListaccountPlans = function()
		{
			$http({
              method: 'GET'
              , url: '/api/ListaccountPlans/'
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.ACPlanList = response.data;
			$(".loader").fadeOut("slow");
			$scope.pagination($scope.ACPlanList);
		});
		};
		
		
		$scope.getAccountPlansDetails = function(acplanid)
		{
			
			
			$http({
              method: 'GET'
              , url: '/api/getAccountPlansDetails/'+acplanid
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.accountPlans = response.data;
			if($scope.memberAccounts)
			{
				
			
				
				$scope.memberAccounts[0].gourentorsdetails = [];
				$scope.memberAccounts[0].accounttypeid = $scope.accountPlans[0].actypeid._id;
				$scope.memberAccounts[0].interestrate = $scope.accountPlans[0].interestrate;
				$scope.memberAccounts[0].investedamount = $scope.accountPlans[0].basicamount;
				$scope.memberAccounts[0].netamount = $scope.accountPlans[0].netamount;
				$scope.memberAccounts[0].emi = $scope.accountPlans[0].emiamount;
				$scope.memberAccounts[0].loanamount = $scope.accountPlans[0].loanamount;
				$scope.memberAccounts[0].tenure = $scope.accountPlans[0].tenure;
				$scope.memberAccounts[0].tenuretype = $scope.accountPlans[0].tenuretype;
				$scope.memberAccounts[0].frequency = $scope.accountPlans[0].frequency;
				if($scope.accountPlans[0].actypeid.noguarantors)
				{
					for(var i = 0 ; i < parseInt($scope.accountPlans[0].actypeid.noguarantors);i++)
					{
						$scope.memberAccounts[0].gourentorsdetails.push({gaumembername:''});
					}
				}
			}
		});
		};
		
		
		$scope.ListAnotherGuarantor = function(guaantorsarray)
		{
			$http({
				method  : 'POST',
				url     : '/api/ListAnotherGuarantor/',
				data    : {guarantors:guaantorsarray,memberdetails:$scope.membersDetails[0]},
				headers : {'Content-Type': 'application/json'} 
				}).then(function(response) {
				$scope.guaMembersList = response.data;
			});
		};
		
		$scope.Clearfield =function(index)
		{
			$scope.memberAccounts[0].gourentorsdetails.splice(index, 1);
			$scope.ListAnotherGuarantor($scope.memberAccounts[0].gourentorsdetails);
			$scope.memberAccounts[0].gourentorsdetails.push({gaumembername:''});
		};
		
		
		
		$scope.DeleteACPlanDetails = function(acplanid)
	{
		var yes = confirm('Are yuo sure? \n Record will never get you back after delete it')
				if(yes)
				{
					$http({
						  method: 'DELETE'
						  , url: '/api/DeleteACPlanDetails/'+acplanid
						  , dataType: 'jsonp'
						}).then(function (response) {
						alert(response.data.message);
						$scope.ListaccountPlans();
					});
				}
	}
		
		$scope.SaveAccountPlan = function()
		{
			$scope.accountPlans[0].createdby = userid
		$http({
			method  : 'POST',
			url     : '/api/SaveAccountPlan/',
			data    : $scope.accountPlans[0] ,
			headers : {'Content-Type': 'application/json'} 
		}).then(function(response) {
			alert(response.data.message);
			$scope.accountPlans =[];
			$scope.ListaccountPlans();
		});
		};
	
				function calcumateemi(tenure,amount,interest){
					var monthlyInterestRatio = (interest/100)/12;
					var top = Math.pow((1+monthlyInterestRatio),tenure);
					var bottom = top -1;
					var sp = top / bottom;
					var emi = ((amount * monthlyInterestRatio) * sp);
					return Math.floor(emi);
				}
				
	
	
		$scope.CalculateNetAmount = function()
		{
			
			if($scope.accountPlans[0].actypeid.installments === 'Yes')
			{
				if($scope.accountPlans[0].tenuretype === 'Days')
				{
					$scope.accountPlans[0].emiamount = String(calcumateemi($scope.accountPlans[0].tenure,$scope.accountPlans[0].loanamount,$scope.accountPlans[0].interestrate));
				}
				else
				{
					$scope.accountPlans[0].emiamount = String(calcumateemi(($scope.accountPlans[0].tenure * 30),$scope.accountPlans[0].loanamount,$scope.accountPlans[0].interestrate));
				}
			}
			else
			{
				if($scope.accountPlans[0].tenuretype === 'Days')
				{
					$scope.accountPlans[0].netamount =  (($scope.accountPlans[0].basicamount * $scope.accountPlans[0].tenure) + (($scope.accountPlans[0].basicamount * $scope.accountPlans[0].tenure) * $scope.accountPlans[0].interestrate / 100));
					$scope.accountPlans[0].netamount = String($scope.accountPlans[0].netamount);
				}
				else
				{
						
					$scope.accountPlans[0].netamount =  (($scope.accountPlans[0].basicamount * ($scope.accountPlans[0].tenure * 30)) + (($scope.accountPlans[0].basicamount * ($scope.accountPlans[0].tenure * 30)) * $scope.accountPlans[0].interestrate / 100));
						$scope.accountPlans[0].netamount = String($scope.accountPlans[0].netamount);
				}
			}
		}
	
	
	
	/* ---ACCOUNT PLANS */
	
	
	/* EMI CACLULATOR */
	
	
	 $scope.submit = function(){
				
				
				function calcumateemi(tenure,amount,interest,month){
					var monthlyInterestRatio = (interest/100)/12;
					var top = Math.pow((1+monthlyInterestRatio),tenure);
					var bottom = top -1;
					var sp = top / bottom;
					var emi = ((amount * monthlyInterestRatio) * sp);
					return Math.floor(emi);
				}
				
				function getInterest(tenure,amount,interest,month){
					var inte = (interest/100)
				}
					 
					 
					 if($scope.entry.tenuretype === 'Days')
					 {
						 var tenureType  = 'Day'
					 }
					 if($scope.entry.tenuretype === 'Months')
					 {
						 var tenureType  = 'Month'
					 }
					 
					  var vals = $scope.entry, i;
					  $scope.months =[];
					  $("#emiTable").show("slow");
					  for(i = 0; i < vals.tenure; i++){
							var m =  tenureType+'-'+(i+ 1);
							var j = (i+1)
					  
							emicalc = calcumateemi(vals.tenure, vals.amount, vals.interest, i);
							interestTotal = emicalc * vals.tenure;
							$scope.months.push({
								sno : m,
								emi : emicalc, // emicalc,
								balance: Math.floor(interestTotal - (emicalc*j))
							});
						}
						
						
						
				$scope.inter = (calcumateemi($scope.entry.tenure, $scope.entry.amount, $scope.entry.interest, i) * $scope.entry.tenure) - $scope.entry.amount;
				
				$scope.paichargraph = [{'section':'Principle','amount':$scope.entry.amount},{'section':'Total Interest','amount':$scope.inter}]
              
			  
			  var chart = AmCharts.makeChart( "chartdiv", {
				  "type": "pie",
				  "theme": "light",
				  "dataProvider":$scope.paichargraph,
				  "valueField": "amount",
				  "titleField": "section",
				   "balloon":{
				   "fixedPosition":true
				  },
				   'labelsEnabled': true,
					  'autoMargins': false,
					  'marginTop':0,
					  'marginBottom': 0,
					  'marginLeft': 0,
					  'marginRight':0,
					  'pullOutRadius': 0
				} );
			  
			  
          };
	
	
	
	/* EMI CACLULATOR */
	
	
	
	/* MEMBERS ACCOUNTS DETAILS */
	
	
	$scope.SaveMembersACDetails = function(membersACDetails)
		{
			$http({
				method  : 'POST',
				url     : '/api/SaveMembersACDetails/',
				data    : membersACDetails[0],
				headers : {'Content-Type': 'application/json'} 
				}).then(function (response) {
					alert(response.data.message);
					$scope.RedirectToForm('/MembersDetails')
			});
		};
		
	
	
	
	/* MEMBERS ACCOUNTS DETAILS */
	
	
	
	
	
	/* REFERANCE */
		$scope.ListAcTypesRef = function()
		{
			$http({
              method: 'GET'
              , url: '/api/ListAcTypesRef/'
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.accountTypesref = response.data;
		});
		};
		
		
		
		
		
	/* REFERANCE */
	
});
	