angular.module("app").controller("decomposeController", function($scope, $http) {
    // input
    $scope.character = "";

    // output
    $scope.kind = -1;
    $scope.part1 = "";
    $scope.part2 = "";

  
    $scope.hasPart2 = function() {
        if ($scope.kind === -1) {
            return true;
        }
        else {
            var array = [
                false, true, true, true, true, true, false, false, true, true, false
            ];
            return array[$scope.kind];
        }
    }
    
    $scope.decomposeCharacter = function() {
        var cp = $scope.character.charCodeAt(0);
        $http.get("/api/char/" + cp.toString())
            .then(function (response) { 
                $scope.kind = response.data.kind;
                $scope.part1 = response.data.part1;
                $scope.part2 = response.data.part2;
            }
        );
    };
});
