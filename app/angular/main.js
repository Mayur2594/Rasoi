angular.module('CSApp', ['ngSanitize','ngRoute','ngResource','ui.bootstrap','ngFileUpload']).config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "public/LandingPage.html",
		controller:"LoginController"
    })
    .when("/Login", {
        templateUrl : "public/Login.html",
		controller:"LoginController"
    })
	.when("/NewUser", {
        templateUrl : "public/NewUser.html",
		controller:"LoginController"
    })
	.when("/Dashboard", {
        templateUrl : "public/Dashboard.html",
		controller:"DashboardController"
    })
	.when("/Companies", {
        templateUrl : "public/Companies.html",
		controller:"DashboardController"
    })
	.when("/Users", {
        templateUrl : "public/Users.html",
		controller:"DashboardController"
    })
	.when("/Orders", {
        templateUrl : "public/Orders.html",
		controller:"DashboardController"
    })
	.when("/Offers", {
        templateUrl : "public/Offers.html",
		controller:"DashboardController"
    })
	.when("/MenuCards", {
        templateUrl : "public/MenuCards.html",
		controller:"DashboardController"
    })
	.when("/Statistics", {
        templateUrl : "public/Statistics.html",
		controller:"DashboardController"
    })
	.when("/MembersDetails", {
        templateUrl : "public/MembersDetails.html",
		controller:"MembersController"
    })
	.when("/AgentsDetails", {
        templateUrl : "public/AgentsDetails.html",
		controller:"AgentsController"
    })
	.when("/TermsNConditions", {
        templateUrl : "public/TermsNConditions.html",
		controller:"OfficeController"
    })
	.when("/Profile", {
        templateUrl : "public/Profile.html",
		controller:"EmployeesController"
    })
	.otherwise({
		  redirectTo: ''
		});
}).filter('startFrom', function () {
    return function (input, start) {
        start = +start;
       if(input!=undefined)
        {return input.slice(start);}
    }
}).directive('inputFocusFunction', function() {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        // Parse the attribute to accomodate assignment to an object
        var parseObj = attr.inputFocusFunction.split('.');
        var attachTo = scope;
        for (var i = 0; i < parseObj.length - 1; i++) {
          attachTo = attachTo[parseObj[i]];
        }
        // assign it to a function that focuses on the decorated element
        attachTo[parseObj[parseObj.length - 1]] = function() {
          element[0].focus();
        };
      }
    };
  });

