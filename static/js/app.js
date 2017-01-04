"use strict";

var app = angular.module("app", ["ngRoute"]);

app.config(["$routeProvider",
    function($routeProvider) {
        $routeProvider.
            when("/", {
                templateUrl: "/static/partials/index.html",
                controller: "indexController"
            }).
            when("/compose", {
                templateUrl: "/static/partials/compose.html",
                controller: "composeController"
            }).
            when("/decompose", {
                templateUrl: "/static/partials/decompose.html",
                controller: "decomposeController"
            }).
            when("/about", {
                templateUrl: "/static/partials/about.html",
                controller: "aboutController"
            }).
            otherwise({
                redirectTo: "/"
            });
    }]);
