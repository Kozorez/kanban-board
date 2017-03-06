angular.module('KanbanBoardServices').factory('ProjectsService', function ProjectsService($http) {
  var baseURL = "http://localhost:3000";

  return {
    getProjects: function (user_id) {
      return $http.get(baseURL + "/users/" + user_id + "/projects/").then(function(response) {
        return response.data;
      });
    },
    addProject: function (project) {
      return $http.post(baseURL + "/projects/", project).then(function(response) {
        return response.data;
      });
    },
    getProject: function (project_id) {
      return $http.get(baseURL + "/projects/" + project_id).then(function(response) {
        return response.data;
      });
    },
    editProject: function (project) {
      return $http.put(baseURL + "/projects/" + project._id, project).then(function(response) {
        return response.data;
      });
    },
    deleteProject: function (project_id) {
      return $http.delete(baseURL + "/projects/" + project_id).then(function(response) {
        return response.data;
      });
    },
    addTask: function (task) {
      return $http.post(baseURL + "/tasks/", task).then(function(response) {
        return response.data;
      });
    },
    editTask: function (task) {
      return $http.put(baseURL + "/tasks/" + task._id, task).then(function(response) {
        return response.data;
      });
    },
    deleteTask: function (task_id) {
      return $http.delete(baseURL + "/tasks/" + task_id).then(function(response) {
        return response.data;
      });
    }
  }
});
