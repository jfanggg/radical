"use strict";

var app = angular.module("app", [
 "ngRoute",
]);

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

app.controller("indexController", function($scope) {

});
app.controller("composeController", function($scope, $http) {
  // input
  $scope.kind = 0;
  $scope.part1 = "";
  $scope.part2 = "";

  // output
  $scope.characters = [];

  $scope.composeCharacters = function() {
    console.log("scope kind is " + $scope.kind)
    var url = "/api/chars/?"
    if ($scope.kind !== 0) {
      url += "kind=" + $scope.kind.toString() + "&";
    }
    if ($scope.part1 !== "") {
      url += "part1=" + $scope.part1.charCodeAt(0).toString() + "&";
    }
    if ($scope.part2 !== "") {
      url += "part2=" + $scope.part2.charCodeAt(0).toString();
    }

    $http.get(url)
    .then(function (response) { 
      $scope.characters = response.data.characters;
    });
  }
});
app.controller("decomposeController", function($scope, $http) {
  // input
  $scope.character = "";

  // output
  $scope.kind = 0;
  $scope.part1 = "";
  $scope.part2 = "";

  $scope.decomposeCharacter = function() {
    var cp = $scope.character.charCodeAt(0);
    $http.get("/api/char/" + cp.toString())
    .then(function (response) { 
      $scope.kind = response.data.kind;
      $scope.part1 = response.data.part1;
      $scope.part2 = response.data.part2;
    });
  }
});
