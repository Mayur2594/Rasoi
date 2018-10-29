angular.module('CSApp')
.controller('DashboardController',['$scope','$http','$route','$location','$window', 'Upload',function ($scope,$http,$route,$location,$window,Upload) {
	
	 M.AutoInit();
	 
	 
	 
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
	 
			$scope.getCompaniesDetails = function()
			{
				$http({
              method: 'GET'
              , url: '/api/getCompaniesDetails/'
              , dataType: 'jsonp'
					}).then(function (response) {
					$scope.companyesList = response.data;
					$scope.pagination($scope.companyesList);
				});
			};
			
			$scope.getCompanyData = function(compid)
			{
				$http({
              method: 'GET'
              , url: '/api/getCompanyData/'+compid
              , dataType: 'jsonp'
					}).then(function (response) {
					$scope.companyesDetails = response.data;
					console.log($scope.companyesDetails);
					
					 var map;
					
					map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: new google.maps.LatLng($scope.companyesDetails[0].address[0].lat,$scope.companyesDetails[0].address[0].lan),
          mapTypeId: 'roadmap'
        });

        var iconBase = '../uploads/';
        var icons = {
          comimg: {
            icon: iconBase + $scope.companyesDetails[0].companypic
          }};

        var features = [
          {
            position: new google.maps.LatLng($scope.companyesDetails[0].address[0].lat,$scope.companyesDetails[0].address[0].lan),
            type: 'comimg'
          }
        ];

        // Create markers.
        features.forEach(function(feature) {
          var marker = new google.maps.Marker({
            position: feature.position,
            icon: icons[feature.type].icon,
            map: map
          });
        });
					
					
					
				});
			}
	 
	 
}]);
	