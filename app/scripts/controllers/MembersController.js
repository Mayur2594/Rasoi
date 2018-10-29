angular.module('CSApp')
.controller('MembersController',['$scope','$http','$route','$location','$window', 'Upload',function ($scope,$http,$route,$location,$window,Upload) {
		
		 M.AutoInit();
	 
		
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
	
}]);
	