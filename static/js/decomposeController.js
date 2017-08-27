angular.module("app").controller("decomposeController", 
    function($scope, $http, $location) {
    /* CONSTANTS */
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
    $scope.part1Names = [
        "Whole", "Left", "Top", "Inner", "Top", "Outer", "Part", "Part",
        "Top", "Part", "Whole"
    ];
    $scope.part2Names = [
        "", "Right", "Bottom", "Outer", "Bottom", "Inner", "", "", "Bottom", 
        "Part", ""
    ]
    $scope.ybUrl = "https://www.yellowbridge.com/chinese/dictionary.php?word=";
    $scope.hcUrl = "http://www.hanzicraft.com/character/";
    $scope.lineUrl = "http://ce.linedict.com/#/cnen/search?query=";
    $scope.googleUrl = "https://translate.google.com/#zh-CN/en/";

    /* INPUT */
    $scope.character = "好";

    /* OUTPUT */
    $scope.kind = 0;
    $scope.part1 = "";
    $scope.part2 = "";

    /* FUNCTIONS */
    $scope.isCharacter1 = function() {
        return $scope.part1.length == 1 && $scope.part1[0] !== "?";
    }

    $scope.isCharacter2 = function() {
        return $scope.part2.length == 1 && $scope.part2[0] !== "?";
    }

    $scope.limit = function(oldValue) {
        // I'm sorry I don't know how to write this more cleanly
        var count = 0;
        var first = "";
        $scope.character = $scope.character.trim();
        for (var c of $scope.character) {
            if (count == 0) {
                first = c;
            }
            count++;
        }

        if (oldValue === "" || count <= 1) {
            $scope.character = first;
        }
        else {
            $scope.character = oldValue;
        }
        return oldValue !== $scope.character;
    }

    $scope.getPart = function(part, getX) {
        if (typeof(getX) === "undefined") getX = false;

        if (part.length == 1) {
            return part[0];
        }
        if (getX) {
            return "⨉";
        }
        else {
            var string = "";
            for (var i = 0; i < part.length; i++) {
                string += part[i];
            }
            return string;
        }
    }

    $scope.getPart1 = function(getX) {
        return $scope.getPart($scope.part1, getX);
    }

    $scope.getPart2 = function(getX) {
        return $scope.getPart($scope.part2, getX);
    }

    $scope.getMessage = function(part) {
        if (part.length !== 1 || part == "?") {
            var message = "The composition \"";
            for (var i = 0; i < part.length; i++) {
                message += part[i];
            }
            message += "\" doesn't exist as a character.";
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
    
    $scope.decompose = function() {
        var cp = $scope.character.charCodeAt(0);
        $http.get("/api/char/" + cp.toString())
            .then(function (response) { 
                $scope.kind = response.data.kind;
                $scope.part1 = response.data.part1;
                $scope.part2 = response.data.part2;
                // handles *'s for repetitions
                if ($scope.part2.length == 1 && $scope.part2[0] == "*" && 
                    $scope.hasPart2[$scope.kind]) {
                    $scope.part2 = $scope.part1;
                }
            }
        );
    };

    $scope.composeKind = function() {
        location.href = "#/compose?kind=" + $scope.kind;
    }

    $scope.composePart1 = function() {
        location.href = "#/compose?kind=" + $scope.kind + "&part1=" + 
                        $scope.getPart1();
    }

    $scope.composePart2 = function() {
        location.href = "#/compose?kind=" + $scope.kind + "&part2=" + 
                        $scope.getPart2();
    }

    $scope.getYB = function(character) {
        return $scope.ybUrl + character;
    }
    $scope.getHC = function(character) {
        return $scope.hcUrl + character;
    }
    $scope.getLINE = function(character) {
        return $scope.lineUrl + character;
    }
    $scope.getGoogle = function(character) {
        return $scope.googleUrl + character;
    }

    /* INITIAL SETUP */
    var params = $location.search();
    if ("char" in params) {
        $scope.character = params["char"];
    }
    $scope.decompose();
});
