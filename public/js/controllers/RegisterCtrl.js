angular.module('KanbanBoardControllers').controller('RegisterCtrl', ['$scope', '$location', 'RegisterService',
  function RegisterCtrl($scope, $location, RegisterService) {
    $scope.registerUser = {};
    $scope.isInvalid = false;

    $scope.register = function() {
      register($scope.registerUser);
    };

    var register = function(registerUser) {
      RegisterService.register(registerUser).then(function (results) {
        $scope.registerForm.$setPristine();
        $scope.registerForm.username.$setUntouched();
        $scope.registerForm.password.$setUntouched();

        if (results.response === "ok") {
          $scope.isInvalid = false;
          $location.path("/login");
        } else if (results.response === "null") {
          $scope.isInvalid = true;
          $scope.registerUser = {};
        }
      });
    };
}]);
