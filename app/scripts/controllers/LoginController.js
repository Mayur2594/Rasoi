angular.module('CSApp')
.controller('LoginController',['$scope','$http','$route','$location','$window','$timeout', 'Upload',function ($scope,$http,$route,$location,$window,$timeout,Upload) {
	
	
	
	 M.AutoInit();
	 
	 var instance = M.Carousel.init({
		indicators: true
	});
	
	autoplay()   
	function autoplay() {
		$('.carousel').carousel('next');
		setTimeout(autoplay, 4500);
	}
	 
	
  $timeout( function(){
            $scope.test1 = "Hello World!";
        }, 5000 );

        //time
        $scope.time = 60;
        
        //timer callback
        var timer = function() {
            if( $scope.time > 0 ) {
                $scope.time -= 1;
                $timeout(timer, 1000);
            }
			
        }
        
        //run!!
       
	
	
	$scope.showHidePassword = function(elemid)
  {
		var elm = document.getElementById("togglcls");
		var passwordfield = document.getElementById(elemid);
		if (passwordfield.type === "password") {
			passwordfield.type = "text";
			elm.innerHTML = "visibility_off";
		}
		else {
			passwordfield.type = "password";
			elm.innerHTML = "visibility";
		}
		
		
		
  };
  
	$scope.forgotpasswordWindow = function(degree)
	{
			var elm = document.getElementById("psfld");
			elm.classList.toggle("hiddenelem");
			document.getElementById("flippanel").style.transform = "rotateY("+degree+"deg)";
	};
	
	$scope.authUser = function()
	{				console.log($scope.userDetails )
			$http({
			method  : 'POST',
			url     : '/api/authUser',
			data    : $scope.userDetails ,
			headers : {'Content-Type': 'application/json'} 
		}).then(function(response) {
			if(response.data.success === true)
			{
				$location.path('/Dashboard');
			}
			if(response.data.success === false)
			{
				$scope.errormsg = response.data.message
			}
		});
	};
	
	
	$scope.ResetPassword = function()
	{			
			$http({
			method  : 'POST',
			url     : '/api/ResetPassword',
			data    : $scope.usersPassworddata ,
			headers : {'Content-Type': 'application/json'} 
		}).then(function(response) {
			alert(response.data.message);
			location.reload();
		});
	};
	
	$scope.arrayObj = [{otp:''},{otp:''},{otp:''},{otp:''},{otp:''},{otp:''}];
	$scope.focusIndex = 0;
	$scope.ForgotPassword = function()
	{		

		 $http({
			method  : 'POST',
			url     : '/api/ForgotPassword',
			data    : $scope.user ,
			headers : {'Content-Type': 'application/json'} 
		}).then(function(response) {
			
			if(response.data.success === true)
			{
				$scope.message =  response.data.message;
				$('#myModallOTP').modal({
                        backdrop: 'static',
                        keyboard: true, 
                        show: true
                });
				 $timeout( function(){
					 $scope.showbtn = true;
							$timeout(timer, 1000); 
					}, 20000 );
				 
	
			}
			else
			{
				alert(response.data.message)
			}
		}); 
	};

		$scope.SetFocus = function(index)
		{
			$scope.focusIndex = index;
		};
		
		$scope.SubmitOtpAnResetpassword = function()
		{
			var OTP = '';
			$scope.arrayObj.map(function(indval)
			{
				OTP = OTP+''+indval.otp;
			});
			
			$http({
              method: 'GET'
              , url: '/api/verifyOTP/'+OTP.trim()
              , dataType: 'jsonp'
			}).then(function (response) {
				if(response.data.status === 0)
				{
					$('#myModallOTP').modal({show: false});
					$('#myModallNewPassword').modal({
                        backdrop: 'static',
                        keyboard: true, 
                        show: true
                });
				}
				else
				{
					alert(response.data.message);
				}
		});
		};
		
		$(document).ready(function(){
			$('select').formSelect();
		});
		
		$scope.usersdetails = [{password:'321',
	firstname:'',
	lastname:'',
	mobile:'',
	email:'',
	role:''}];
	
	$scope.userlevels = ['Superadmin','Admin','Staff'];
		
		
		$scope.AddNewUser = function()
		{
			var sorted_arr = $scope.usersdetails.slice().sort();
			var count = 0; 
			for (var i = 0; i < sorted_arr.length - 1; i++) {
				if (sorted_arr[i + 1].mobile === sorted_arr[i].mobile) {
					count = count +1;
					alert(sorted_arr[i + 1].mobile + 'is duplicate or blank please correct it');
				}
				if (sorted_arr[i + 1].email === sorted_arr[i].email) {
					count = count +1;
					alert(sorted_arr[i + 1].email + 'is duplicate  or blank please correct it');
				}
			}
			if(count == 0)
			{
				$scope.usersdetails.push({password:'321',firstname:'',lastname:'',mobile:'',email:'',role:''});
			}
		};
		
		$scope.RemoveUser = function(indx)
		{
			$scope.usersdetails.map(function(value,index)
			{
				if(indx === index)
				{
					$scope.usersdetails.splice(indx,1);
				}
			})
		}
		
		
		
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
                    .attr('src', e.target.result);
            };
            reader.readAsDataURL(selectedfile[0]);
	}; 
		
		$scope.companydetails ={address:[{lat:'',lan:'',address:''}]};
		
		$scope.getCurrentLoaction = function()
		{
			var options = {
                enableHighAccuracy: true
            };

			navigator.geolocation.getCurrentPosition(function(pos) {
                $scope.position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                console.log(JSON.stringify($scope.position));   
				var geocoder = new google.maps.Geocoder;
				
						var latlng = {lat: pos.coords.latitude, lng: pos.coords.longitude};
						geocoder.geocode({'location':  $scope.position}, function(results, status) {
						  if (status === 'OK') {
							if (results[0]) {
								document.getElementById('address').focus();
								$scope.companydetails.address[0].lat = latlng.lat;
								$scope.companydetails.address[0].lan = latlng.lng;
								$scope.companydetails.address[0].address = results[0].formatted_address;
	
							} else {
							  window.alert('No results found');
							}
						  } else {
							window.alert('Geocoder failed due to: ' + status);
						  }
						});
					  
				
				
				
				
            }, 
            function(error) {                    
                alert('Unable to get location: ' + error.message);
            }, options);
		};
		
		
		$scope.SubmitNewCompany = function()
	{
		
		$scope.companydetails.users = $scope.usersdetails;
		
		 if ($scope.newcompany.file.$valid && $scope.file) {
			 var passeddata = {file: $scope.file, companydetails:$scope.companydetails}
		 }
		 else
		 {
			  var passeddata = {companydetails:$scope.companydetails}
		 }
		 
		 console.log(passeddata);
         Upload.upload({
            url: '/api/SubmitNewCompany',
            data: passeddata
        }).then(function (resp) {
            //alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
			alert(resp.data.message);
            //alert('Record inserted successfully');
			$scope.RedirectToForm('/Login');
        }, function (resp) {
            //alert('Error status: ' + resp.status);
            alert('Something went wrong, Please try again!');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });  
	};
		
	
		
		
		
		/* -------------- */
}]).directive('customAutofocus', function() {
  return{
         restrict: 'A',

         link: function(scope, element, attrs){
           scope.$watch(function(){
             return scope.$eval(attrs.customAutofocus);
             },function (newValue){
               if (newValue == true){
                   element[0].focus();
               }
           });
         }
     };
})
;

	