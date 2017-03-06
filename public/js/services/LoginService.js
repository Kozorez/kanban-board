angular.module('KanbanBoardServices').factory('LoginService', function LoginService($http) {
  var baseURL = "http://localhost:3000";

  return {
    login: function (loginUser) {
      return $http.post(baseURL + "/login/", loginUser).then(function(response) {
        return response.data;
      });
    }
  };
});
