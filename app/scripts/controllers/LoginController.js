angular.module('CSApp')
.controller('LoginController',function ($scope,$http,$route,$location,$window,$timeout) {
	
	
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
		var passwordfield = document.getElementById(elemid);
		if (passwordfield.type === "password") {
			passwordfield.type = "text";
		}
		else {
			passwordfield.type = "password";
		}
		var elm = document.getElementById("togglcls");
		elm.classList.toggle("glyphicon-eye-close");
		
  };
  
	$scope.forgotpasswordWindow = function(degree)
	{
			var elm = document.getElementById("psfld");
			elm.classList.toggle("hiddenelem");
			document.getElementById("flippanel").style.transform = "rotateY("+degree+"deg)";
	};
	
	$scope.authUser = function()
	{				
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
		
		
		/* -------------- */
		
		$scope.postdata = function()
		{
			/*  $http({
			method  : 'POST',
			url     : 'http://www.cvlkra.com/PanInquiry.asmx/GetPanStatus',
			data    : {panNo:'CCWPM0948K',userName:'ONWEEQ',PosCode:'1200003103',password:'79ZOguioApEZ4Js5GlYeSg%3d%3d',PassKey:'m'} ,
			headers : {'Content-Type': 'application/json'} 
		}).then(function(response) {
			console.log(response);
		}) */
		
		
		 var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

           /*  $http.post('http://www.cvlkra.com/PanInquiry.asmx/GetPanStatus', [{panNo:'CCWPM0948K',userName:'ONWEEQ',PosCode:'1200003103',password:'79ZOguioApEZ4Js5GlYeSg%3d%3d',PassKey:'m'}] , config)
            .success(function (data, status, headers, config) {
                $scope.ServerResponse = data;
				console.log($scope.ServerResponse )
				console.log(headers)
				console.log(status)
            })
            .error(function (data, status, header, config) {
                $scope.ServerResponse = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
            }); */

		function init() {
        FB.api(
				"/286631768727930/events",
				function (response) {
					console.log(response);
				  if (response && !response.error) {
					/* handle the result */
				  }
				}
			);
    }

     window.fbAsyncInit = function() {
    FB.init({
      appId            : '320101055206376',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v3.1'
    });
	init()
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
		
		
		
		
		};
		$scope.postdata();
		
	
	
}).directive('customAutofocus', function() {
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

	