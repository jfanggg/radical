angular.module("app").controller("composeController", 
    function($scope, $http, $location) {    

    /* CONSTANTS */
    $scope.titles = [
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
    $scope.ybUrl = "http://www.yellowbridge.com/chinese/dictionary.php?word=";
    $scope.hcUrl = "http://www.hanzicraft.com/character/";
    $scope.lineUrl = "http://ce.linedict.com/#/cnen/search?query=";
    $scope.googleUrl = "https://translate.google.com/#zh-CN/en/";

    $scope.rows = 5;
    $scope.cols = 10;

    /* STATE */
    // table start and end (0-indexed)
    $scope.start = 0;
    $scope.end = 0;
    // # characters total that match the filter
    $scope.matches = 0;
    $scope.tableMode = true;
    $scope.focusedCharacter = "";

    /* INPUT */
    $scope.kind = 0;
    $scope.part1 = "";
    $scope.part2 = "";

    /* OUTPUT */
    $scope.characters = [];
    
    /* FUNCTIONS */
    // utilities and such
    $scope.range = function(number) {
        var arr = new Array(number);
        for (var i = 0; i < number; i++) {
            arr[i] = i;
        }
        return arr;
    }

    $scope.getChar = function(r, c) {
        var index = r * $scope.cols + c;
        if (index >= $scope.characters.length) {
            return "";
        }
        else {
            return $scope.characters[index];
        }
    }

    $scope.getResultsMessage = function() {
      if ($scope.tableMode) {
          if ($scope.characters.length > 0) {
              return "Displaying characters " + ($scope.start + 1) + "~" + 
                      ($scope.end + 1) + " out of " + $scope.matches +
                      " matches. Click for more options"
          }
          else {
              return "No matches to show"
          }
      } 
      else {
          return "Displaying character \"" + $scope.focusedCharacter + "\"";
      }
    }

    $scope.updateEnd = function() {
        $scope.end = $scope.start - 1 +
            Math.min($scope.characters.length, $scope.rows * $scope.cols);
    }

    $scope.clearParts = function() {
        $scope.part1 = "";
        $scope.part2 = "";
    }

    $scope.compose = function(start) {
        var partQuery = function(part, number) {
            var query = "";
            if (part !== "") {
                query += "part" + number + "=";
                for (var c of part) {
                    query += c.codePointAt(0).toString() + "-";
                }
                // delete the last '-'
                query = query.substring(0, query.length - 1); 
                query += "&";
            }
            return query;
        }

        var url = "/api/chars/?";
        url += "kind=" + $scope.kind.toString() + "&";
        url += partQuery($scope.part1, "1");
        url += partQuery($scope.part2, "2");
        url += "start=" + start;
        
        $http.get(url)
        .then(function (response) { 
            $scope.characters = response.data.characters;
            $scope.matches = response.data.num_characters;

            $scope.start = start;
            $scope.updateEnd();

            $scope.tableMode = true;
        });
    };

    // arrow stuff
    $scope.hasLeft = function() {
        return $scope.start > 0;
    }

    $scope.shiftLeft = function() {
        if (!$scope.hasLeft()) {
            return;
        }
        var start = $scope.start - $scope.rows * $scope.cols;
        start = Math.max(0, start);
        $scope.compose(start);
    };

    $scope.getLeftImg = function() {
        if ($scope.hasLeft()) {
            return '/static/img/left.png';
        }
        else {
            return '/static/img/left-disabled.png';
        }
    }

    $scope.hasRight = function() {
        return ($scope.end + 1) < $scope.matches;
    }

    $scope.shiftRight = function() {
        if (!$scope.hasRight()) {
            return;
        }
        $scope.compose($scope.end + 1);
    };

    $scope.getRightImg = function() {
        if ($scope.hasRight()) {
            return '/static/img/right.png';
        } else {
            return '/static/img/right-disabled.png';
        }
    }

    // character detail stuff
    $scope.focus = function(character) {
        $scope.focusedCharacter = character;
        $scope.tableMode = false;
    }
    $scope.unfocus = function() {
        $scope.tableMode = true;
    }

    $scope.decompose = function() {
        location.href = "#/decompose?char=" + $scope.focusedCharacter;
    }

    $scope.getYB = function() {
        return $scope.ybUrl + $scope.focusedCharacter;
    }
    $scope.getHC = function() {
        return $scope.hcUrl + $scope.focusedCharacter;
    }
    $scope.getLINE = function() {
        return $scope.lineUrl + $scope.focusedCharacter;
    }
    $scope.getGoogle = function() {
        return $scope.googleUrl + $scope.focusedCharacter;
    }

    // also some jQuery stuff to dynamically change # of cols
    $(window).resize(function() {                                       
        var old = $scope.cols;
        var width = $(this).width();
        var cellSize = width > 480 ? 80 : 60;
        $scope.cols = Math.min(Math.floor((width - 50) / cellSize), 10);

        // limit to 10 columns
        $scope.cols = Math.min($scope.cols, 10);

        if (old !== $scope.cols && $scope.tableMode) {
            $scope.$apply();
            $scope.compose($scope.start);
        }
    }); 

    /* INITIAL SETUP */
    var width = $(window).width();
    var cellSize = width > 480 ? 80 : 60;
    $scope.cols = Math.min(Math.floor((width - 50) / cellSize), 10);

    var params = $location.search();
    if ("kind" in params) {
        $scope.kind = parseInt(params["kind"]);
        if (!(0 <= $scope.kind && $scope.kind < 10)) {
            $scope.kind = 0;
        }
    }
    if ("part1" in params) {
        $scope.part1 = params["part1"];
    }
    if ("part2" in params) {
        $scope.part2 = params["part2"];
    }
    $scope.compose(0);

});
