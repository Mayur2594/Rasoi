angular.module('CSApp')
.controller('EmployeesController', ['$scope','$http','$route','$location','$window', 'Upload',function ($scope,$http,$route,$location,$window,Upload) {
	
	var url = window.location.href;
	var qparts = url.split("?");
	var passvar = qparts[1];
	
	$scope.RedirectToForm = function(redirectpath)
	{
		$location.search('')
		$location.path(redirectpath);
	};
	
	
	
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
								$(".loader").fadeOut("slow");
					$scope.numberOfPages = function () {
						return Math.ceil(listdata.length / $scope.pageSize);
					};
			};
	
	 $scope.clear = function () {
		 angular.element("input[type='file']").val(null);
		document.getElementById("imgpanel").src = '';
	};
	
	
	
		
		$scope.ListEmployees = function()
		{
			$http({
              method: 'GET'
              , url: '/api/ListEmployees/'
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.EmployeesList = response.data;
			$scope.pagination($scope.EmployeesList);
		});
		};
		
		$scope.VerifyrequiredFields = function(value,field)
		{
				$http({
				method  : 'POST',
				url     : '/api/VerifyrequiredFields/',
				data    : {verification:value,field:String(field),userid:passvar},
				headers : {'Content-Type': 'application/json'} 
				}).then(function(response) {
					$scope.errormsg = response.data.message;
					if(response.data.status === 1)
					{
						document.getElementById("sbmt").disabled = true;
					}
					else(response.data.status === 1)
					{
						document.getElementById("sbmt").disabled = false;
					}
				});
		};
		
		$scope.getEmployeesDetails = function()
		{
			if(passvar)
			{
				$http({
				  method: 'GET'
				  , url: '/api/getEmployeesDetails/'+passvar
				  , dataType: 'jsonp'
				}).then(function (response) {
					$scope.employee = response.data;
					$scope.employee[0].dob = new Date($scope.employee[0].dob)
					$scope.employee[0].doj = new Date($scope.employee[0].doj)
				});
			}
		};
		
		
		$scope.DeleteEmployeesDetails = function(empid)
	{
		var yes = confirm('Are yuo sure? \n Record will never get you back after delete it')
				if(yes)
				{
					$http({
						  method: 'DELETE'
						  , url: '/api/DeleteEmployeesDetails/'+empid
						  , dataType: 'jsonp'
						}).then(function (response) {
						alert(response.data.message);
						$scope.ListEmployees();
					});
				}
	}
	
	
	$scope.SaveEmployeeDetails = function()
	{
		 if ($scope.empdetails.file.$valid && $scope.file) {
			 var passeddata = {file: $scope.file, employeedetails:$scope.employee[0]}
		 }
		 else
		 {
			  var passeddata = {employeedetails:$scope.employee[0]}
		 }
        Upload.upload({
            url: '/api/SaveEmployeesDetails',
            data: passeddata
        }).then(function (resp) {
            //alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            alert('Record inserted successfully');
			$scope.RedirectToForm('/EmployeeDetails');
        }, function (resp) {
            //alert('Error status: ' + resp.status);
            alert('Something went wrong, Please try again!');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        }); 
	};
	
	$scope.RedirectToEmployeeform = function(empid)
	{
		$location.path('/EmployeeForm/').search(empid);
	}
	
	
		  
	$scope.getUserProfile = function()
		{
			$http({
              method: 'GET'
              , url: '/api/getUserProfile/'
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.UserProfile = response.data;
			console.log($scope.UserProfile);
			$scope.pagination($scope.UserProfile);
		});
		};
		
	
	
	
}]);
	