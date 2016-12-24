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

app.controller("indexController", function($scope) {

});
app.controller("composeController", function($scope, $http) {    
  // constants 
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
  $scope.lineUrl = "http://ce.linedict.com/#/cnen/search?query=";
  $scope.googleUrl = "https://translate.google.com/#zh-CN/en/";
  $scope.ybUrl = "http://www.yellowbridge.com/chinese/dictionary.php?word=";
  $scope.mdbgUrl = "http://www.yellowbridge.com/chinese/dictionary.php?word=";

  $scope.tableRows = 5;
  $scope.tableCols = 10;

  // current state
  // where the table starts and ends (1-indexed)
  $scope.charactersStart = 0;
  $scope.charactersEnd = 0;
  // how many characters there are total that match the current filter
  $scope.numCharacters = 0;
  $scope.tableMode = true;
  $scope.focusedCharacter = "";

  // input
  $scope.kind = 0;
  $scope.part1 = "";
  $scope.part2 = "";

  // output
  $scope.characters = [];
  $scope.table = [];
  for (var i = 0; i < $scope.tableRows; i++) {
      $scope.table.push(new Array(10).fill(""));
  }
  
  // functions
  $scope.getResultsMessage = function() {
    if ($scope.tableMode) {
        if ($scope.characters.length > 0) {
          return "Displaying characters " + $scope.charactersStart + "~" + 
                  $scope.charactersEnd + " out of " + $scope.numCharacters +
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

  $scope.clearTable = function() {
    for (var i = 0; i < $scope.tableRows; i++) {
      for (var j = 0; j < $scope.tableCols; j++) {
        $scope.table[i][j] = "";
      }
    }
  }

  $scope.loadTable = function() {
    $scope.clearTable();
    for (var i = 0; i < $scope.tableRows; i++) {
      for (var j = 0; j < $scope.tableCols; j++) {
        var current = i * $scope.tableCols + j;

        // If you don't have enough characters, break early
        if (current >= $scope.characters.length) {
          return;
        }

        $scope.table[i][j] = $scope.characters[current];
      }
    }
  };

  $scope.composeCharacters = function(start) {
      // default argument
      if (typeof(start) == "undefined") {
          start = 0;
      }

      var url = "/api/chars/?";
      url += "kind=" + $scope.kind.toString() + "&";
      if ($scope.part1 !== "") {
          url += "part1=" + $scope.part1.charCodeAt(0).toString() + "&";
      }
      if ($scope.part2 !== "") {
          url += "part2=" + $scope.part2.charCodeAt(0).toString() + "&";
      }
      url += "start=" + start;
      

      $http.get(url)
      .then(function (response) { 
          $scope.characters = response.data.characters;
          $scope.numCharacters = response.data.num_characters;

          $scope.charactersStart = start + 1;
          $scope.charactersEnd = $scope.charactersStart + $scope.characters.length - 1;

          $scope.tableMode = true;
          $scope.loadTable();
      });
  };

  $scope.focus = function(character) {
      $scope.focusedCharacter = character;
      $scope.tableMode = false;
  }
  
  $scope.unfocus = function() {
      $scope.tableMode = true;
  }
  
  $scope.canShiftLeft = function() {
      return $scope.charactersStart > 1;
  }

  $scope.shiftLeft = function() {
      if (!$scope.canShiftLeft()) {
        return;
      }
      var start = $scope.charactersStart - $scope.tableRows * $scope.tableCols
                  - 1;
      start = Math.max(0, start); // if you get unaligned for whatever reason
      $scope.composeCharacters(start);
  };

  $scope.getLeftImg = function() {
      if ($scope.canShiftLeft()) {
          return '/static/img/left.png';
      }
      else {
          return '/static/img/left-disabled.png';
      }
  }

  $scope.canShiftRight = function() {
      return $scope.charactersEnd < $scope.numCharacters;
  }

  $scope.shiftRight = function() {
      if (!$scope.canShiftRight()) {
          return;
      }
      $scope.composeCharacters($scope.charactersEnd);
  };

  $scope.getRightImg = function() {
      if ($scope.canShiftRight()) {
          return '/static/img/right.png';
      } else {
          return '/static/img/right-disabled.png';
      }
  }

  $scope.getLINE = function() {
      return $scope.lineUrl + $scope.focusedCharacter;
  }
  $scope.getGoogle = function() {
      return $scope.googleUrl + $scope.focusedCharacter;
  }
  $scope.getYB = function() {
      return $scope.ybUrl + $scope.focusedCharacter;
  }
  $scope.getMDBG = function() {
      return $scope.mdbgUrl + $scope.focusedCharacter;
  }

  // load table initially
  $scope.composeCharacters();
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
  };
});
