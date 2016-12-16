"use strict";

var app = angular.module("app", ["ngRoute"]);

app.config(["$routeProvider", 
	function($routeProvider) {
		$routeProvider
			.when("/", {
				templateUrl: "/static/partials/index.html"
			})
			.when("/compose", {
				templateUrl: "/static/partials/compose.html"
			})
			.when("/decompose", {
				templateUrl: "/static/partials/decompose.html"
			})
			.when("/about", {
				templateUrl: "/static/partials/about.html"
			});
			.otherwise({
				redirectTo: "/"
			});
	}]);