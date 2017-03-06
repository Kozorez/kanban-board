angular.module('KanbanBoardControllers').controller('LoginCtrl', ['$scope', '$location', 'LoginService', 'UserProjectsService',
  function LoginCtrl($scope, $location, LoginService, UserProjectsService) {
    $scope.loginUser = {};
    $scope.isInvalid = false;

    $scope.login = function() {
      login($scope.loginUser);
    };

    var login = function(loginUser) {
      LoginService.login(loginUser).then(function (results) {
        $scope.loginForm.$setPristine();
        $scope.loginForm.username.$setUntouched();
        $scope.loginForm.password.$setUntouched();

        if (results.response !== "null") {
          $scope.isInvalid = false;
          UserProjectsService.setUser(results.response, $scope.loginUser.username);
          $location.path("/projects");
        } else if (results.response === "null") {
          $scope.isInvalid = true;
          $scope.loginUser = {};
        }
      });
    };
}]);
