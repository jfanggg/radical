angular.module("app").controller("decomposeController", function($scope, $http) {
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
  };
});
