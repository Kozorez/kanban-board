angular.module('KanbanBoardServices').factory('RegisterService', function RegisterService($http) {
  var baseURL = "http://localhost:3000";

  return {
    register: function (registerUser) {
      return $http.post(baseURL + "/register/", registerUser).then(function(response) {
        return response.data;
      });
    }
  };
});
