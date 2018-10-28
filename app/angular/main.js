angular.module('CSApp', ['ngSanitize','ngRoute','ngResource','ui.bootstrap','ngFileUpload']).config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "public/Login.html",
		controller:"LoginController"
    })
    .when("/Login", {
        templateUrl : "public/Login.html",
		controller:"LoginController"
    })
	.when("/Dashboard", {
        templateUrl : "public/Dashboard.html",
		controller:"DashboardController"
    })
	.when("/MembersDetails", {
        templateUrl : "public/MembersDetails.html",
		controller:"MembersController"
    })
	.when("/MembersAccounts", {
        templateUrl : "public/MembersAccounts.html",
		controller:"MembersACController"
    })
	.when("/AreaDetails", {
        templateUrl : "public/AreaDetails.html",
		controller:"MastersController"
    })
	.when("/GroupDetails", {
        templateUrl : "public/GroupDetails.html",
		controller:"MastersController"
    })
	.when("/EventsDetails", {
        templateUrl : "public/EventsDetails.html",
		controller:"MastersController"
    })
	.when("/AgentsDetails", {
        templateUrl : "public/AgentsDetails.html",
		controller:"AgentsController"
    })
	.when("/CollectionLimit", {
        templateUrl : "public/CollectionLimit.html",
		controller:"AgentsController"
    })
	.when("/CollectionList", {
        templateUrl : "public/CollectionList.html",
		controller:"AgentsController"
    })
	.when("/EmployeeDetails", {
        templateUrl : "public/EmployeeDetails.html",
		controller:"EmployeesController"
    })
	.when("/BranchsDetails", {
        templateUrl : "public/BranchsDetails.html",
		controller:"OfficeController"
    })
	.when("/AccountTypes", {
        templateUrl : "public/AccountTypes.html",
		controller:"OfficeController"
    })
	.when("/AccountPlans", {
        templateUrl : "public/AccountPlans.html",
		controller:"OfficeController"
    })
	.when("/TermsNConditions", {
        templateUrl : "public/TermsNConditions.html",
		controller:"OfficeController"
    })
	.when("/EMICalculator", {
        templateUrl : "public/EMICalculator.html",
		controller:"OfficeController"
    })
	.when("/Profile", {
        templateUrl : "public/Profile.html",
		controller:"EmployeesController"
    })
	.when("/Lock", {
        templateUrl : "public/Lock.html",
		controller:"EmployeesController"
    })
	.when("/EmployeeForm", {
        templateUrl : "public/EmployeeForm.html",
		controller:"EmployeesController"
    })
	.when("/MemberForm", {
        templateUrl : "public/MemberForm.html",
		controller:"MembersController"
    })
	.when("/AccountForm", {
        templateUrl : "public/AccountForm.html",
		controller:"MembersController"
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

 M.AutoInit();