angular.module('CSApp')
.controller('MembersController',['$scope','$http','$route','$location','$window', 'Upload',function ($scope,$http,$route,$location,$window,Upload) {
	
	
	var url = window.location.href;
	var qparts = url.split("?");
	var passvar = qparts[1];
	
	$scope.RedirectToForm = function(redirectpath)
	{
		$location.search('')
		$location.path(redirectpath);
	};
	
	
		$scope.RedirectTomembersform = function(rdpage,memid)
		{
			$location.path(rdpage).search(memid);
		};
		
		$scope.RedirectTomembersACform = function(rdpage,memid)
		{
			$location.path(rdpage).search(memid); 
			location.reload();
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
	
	$scope.PassFileValue = function () {
		
			var selectedfile = angular.element("input[type='file']")[0].files;

		$('imgbtn').css("display", "block");
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgpanel')
                    .attr('src', e.target.result)
                    .width(150)
                    .height(200);
            };
            reader.readAsDataURL(selectedfile[0]);
	}; 
	
	
	$scope.VerifyrequiredFieldsInMembers = function(value,field)
		{
				$http({
				method  : 'POST',
				url     : '/api/VerifyrequiredFieldsInMembers/',
				data    : {verification:value,field:String(field),memberid:passvar},
				headers : {'Content-Type': 'application/json'} 
				}).then(function(response) {
					$scope.errormsg = response.data.message;
					if(response.data.status === 1)
					{
						document.getElementById("sbmt").disabled = true;
					}
					else
					{
						document.getElementById("sbmt").disabled = false;
					}
				});
		};
		
		
		$scope.ListMembers = function()
		{
			$http({
              method: 'GET'
              , url: '/api/ListMembers/'
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.membersList = response.data;
			$scope.pagination($scope.membersList);
		});
		};
		
		
		$scope.ListGuarantors = function()
		{
			$http({
				method  : 'POST',
				url     : '/api/ListGuarantors/',
				data    : $scope.membersDetails[0],
				headers : {'Content-Type': 'application/json'} 
				}).then(function (response) {
				$scope.guaMembersList = response.data;
			});
		};
		
		
		
		$scope.GetMembersDetails = function()
		{
			if(passvar)
			{
			$http({
              method: 'GET'
              , url: '/api/GetMembersDetails/'+passvar
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.membersDetails = response.data;
			$scope.memberAccounts = response.data
			
			$scope.membersDetails[0].dob = new Date($scope.membersDetails[0].dob)
			$scope.membersDetails[0].startingdate = new Date($scope.membersDetails[0].startingdate)

			$scope.memberAccounts[0].dob = new Date($scope.memberAccounts[0].dob)
			$scope.memberAccounts[0].startingdate = new Date($scope.memberAccounts[0].startingdate)
		});
			}
		};
		
		
		$scope.DeleteMember = function(memberid)
	{
		var yes = confirm('Are yuo sure? \n Record will never get you back after delete it')
				if(yes)
				{
					$http({
						  method: 'DELETE'
						  , url: '/api/DeleteMember/'+memberid
						  , dataType: 'jsonp'
						}).then(function (response) {
						alert(response.data.message);
						$scope.ListMembers();
					});
				}
	}
	
	
		
		
		
		$scope.SaveMembersDetails = function()
	{
		 if ($scope.memdetails.file.$valid && $scope.file) {
			 var passeddata = {file: $scope.file, membersDetails:$scope.membersDetails[0]}
		 }
		 else
		 {
			  var passeddata = {membersDetails:$scope.membersDetails[0]}
		 }
        Upload.upload({
            url: '/api/SaveMembersDetails',
            data: passeddata
        }).then(function (resp) {
            //alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
			alert(resp.data.message);
            //alert('Record inserted successfully');
			$scope.RedirectToForm('/MembersDetails');
        }, function (resp) {
            //alert('Error status: ' + resp.status);
            alert('Something went wrong, Please try again!');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        }); 
	};
		
	
	
	/* MEMBERS ACCOUNTS DETAILS */
	
	//$scope.memberAccounts = [];
	
	$scope.GetExpiryDate = function()
	{
		if($scope.memberAccounts[0].tenuretype == "Days")
		{
			var days = $scope.memberAccounts[0].tenure;
		}
		if($scope.memberAccounts[0].tenuretype == "Months")
		{
			var days = $scope.memberAccounts[0].tenure * 30;
		}
		$scope.memberAccounts[0].expirydate = new Date($scope.memberAccounts[0].startingdate.getTime() + days*24*60*60*1000);
	};
	
	
		$scope.getMembersAccounts = function(memberid)
		{
			$scope.selectedmemberid = memberid;
			$http({
              method: 'GET'
              , url: '/api/getMembersAccounts/'+memberid
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.membersACDetails = response.data;
		});
			
		};
		
		
		$scope.ListMembersAccounts = function()
		{
			
			$http({
              method: 'GET'
              , url: '/api/ListMembersAccounts/'
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.accountsList = response.data;
			console.log($scope.accountsList);
			$scope.pagination($scope.accountsList);
		});
			
		};
	
		
		
		
		
	
	
}]);
	