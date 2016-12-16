"use strict";   // See note about "use strict"; below

var myApp = angular.module("myApp", [
 "ngRoute",
]);

myApp.config(["$routeProvider",
     function($routeProvider) {
         $routeProvider.
             when("/", {
                 templateUrl: "/static/partials/index.html",
             }).
             when("/compose", {
                 templateUrl: "/static/partials/compose.html",
             }).
             when("/decompose", {
                 templateUrl: "/static/partials/decompose.html",
             }).
             when("/about", {
                 templateUrl: "/static/partials/about.html",
             }).
             otherwise({
                 redirectTo: "/"
             });
    }]);
