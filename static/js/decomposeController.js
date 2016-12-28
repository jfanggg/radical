angular.module("app").controller("decomposeController", function($scope, $http) {
    // constants
    $scope.kindNames = [                                                             
        "Graphical primitive. Non-composition",                                   
        "Horizontal composition ",                                                
        "Vertical composition",                                                   
        "Inclusion of one character inside another",                              
        "Vertical composition. Top part is a repetition",                         
        "Horizontal composition of three. First and third are the same",          
        "Repetition of three",                                                    
        "Repetition of four",                                                     
        "Vertical composition, separated by '冖'",                                
        "Graphical superposition or addition",                                    
        "Deformed version of another character"                                   
    ];     
    $scope.hasPart2 = [
        false, true, true, true, true, true, false, false, true, true, false
    ];
    // 
    $scope.part1Names = [
        "Whole", "Left", "Top", "Inner", "Top", "Outer", "Piece", "Piece",
        "Top", "Piece", "Whole"
    ];
    $scope.part2Names = [
        "", "Right", "Bottom", "Outer", "Bottom", "Inner", "", "", "Bottom", 
        "Piece", ""
    ]

    // input
    $scope.character = "你";

    // output
    $scope.kind = -1;
    $scope.part1 = "";
    $scope.part2 = "";

  

    $scope.getPart1 = function() {
        console.log($scope.part1);
        if ($scope.part1.length == 1) {
            return $scope.part1[0];
        }
        else {
            return "⨉";
        }
    }

    $scope.getPart2 = function() {
        if ($scope.part2.length == 1) {
            return $scope.part2[0];
        }
    }

    $scope.getMessage = function(part) {
        if (part.length !== 1) {
            var message = "The composition containing ";
            for (var i = 0; i < part.length - 1; i++) {
                message += part[i] + ", ";
            }
            message += part[part.length - 1] 
            message += " does not exist as a single character";
            return message;
        }
        else {
            return "";
        }
    }

    $scope.getPart1Message = function() {
        return $scope.getMessage($scope.part1);
    }

    $scope.getPart2Message = function() {
        return $scope.getMessage($scope.part2);
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

    $scope.decomposeCharacter();
});
