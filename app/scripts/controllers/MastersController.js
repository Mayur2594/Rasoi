angular.module('CSApp')
.controller('MastersController',['$scope','$http','$route','$location','$window', 'Upload',function ($scope,$http,$route,$location,$window,Upload) {
	
	
	 M.AutoInit();
	 
	
	/* TEARMS AND CONDITIONS--- */
	
	$scope.termsNConditions = []
	var description = [{point:''}];
	$scope.termsNConditions.push({description:description})
	
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
	
	
	
	
	
	$scope.ListTermsNCondtions = function()
	{
		$http({
              method: 'GET'
              , url: '/api/ListTermsNCondtions/'
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.termsList = response.data;
			$(".loader").fadeOut("slow");
			$scope.pagination($scope.termsList);
		});
	}
	
	
	
	$scope.DeleteTermCondition = function(termid)
	{
		var yes = confirm('Are yuo sure? \n Record will never get you back after delete it')
				if(yes)
				{
					$http({
						  method: 'DELETE'
						  , url: '/api/DeleteTermCondition/'+termid
						  , dataType: 'jsonp'
						}).then(function (response) {
						alert(response.data.message);
						$scope.ListTermsNCondtions();
					});
				}
	}
	
	

	$scope.getTermsDetails = function(termid)
	{
		$http({
              method: 'GET'
              , url: '/api/getTermsDetails/'+termid
              , dataType: 'jsonp'
			}).then(function (response) {
			$scope.termsNConditions = response.data;
		});
	}
	
	
	$scope.AddNewRow = function()
	{
		$scope.termsNConditions[0].description.push({point:''})
	}
	
	$scope.RemoveRow = function(index)
	{		
			if($scope.termsNConditions[0].description[index]._id)
			{
				var yes = confirm('Are yuo sure? \n Record will never get you back after delete it')
				if(yes)
				{
				$http({
					  method: 'DELETE'
					  , url: '/api/RemoveTermDescriptionPoint/'+$scope.termsNConditions[0].description[index]._id+'/'+$scope.termsNConditions[0]._id
					  , dataType: 'jsonp'
					}).then(function (response) {
					if(response.data.status === 1)
					{
						alert(response.data.message)
					}
					else
					{
						$scope.getTermsDetails($scope.termsNConditions[0]._id)
					}
				});
				}
			}
			else
			{
				description.splice(index,1);
			}
			
	}
	
	
	$scope.SaveTermsDetails = function()
	{
		$scope.termsNConditions[0].createdby = userid
		$http({
			method  : 'POST',
			url     : '/api/SaveTermsDetails/',
			data    : $scope.termsNConditions[0] ,
			headers : {'Content-Type': 'application/json'} 
		}).then(function(response) {
			alert(response.data.message);
			$scope.termsNConditions =[];
			$scope.ListTermsNCondtions();
		});
	}
	
	

	

	
	

	
	
}]);
	
	
	
	