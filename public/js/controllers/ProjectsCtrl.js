angular.module('KanbanBoardControllers').controller('ProjectsCtrl', ['$scope', '$location', 'ProjectsService', 'UserProjectsService',
  function ProjectsCtrl($scope, $location, ProjectsService, UserProjectsService) {
    $scope.isError = function() {
      return function(task) {
        return $scope.dateDifferenceInDays(task.date) <= 3;
      };
    };

    $scope.isWarning = function() {
      return function(task) {
        return $scope.dateDifferenceInDays(task.date) > 3 && $scope.dateDifferenceInDays(task.date) <= 7;
      };
    };

    $scope.dateDifferenceInDays = function(date) {
      return (Math.floor((new Date(date) - $scope.today) / (1000 * 60 * 60 * 24)) + 1);
    };

    $scope.today = new Date();

    $scope.createdProject = { tasks: [] };
    $scope.createdTask = {};

    $scope.changedProject = {};
    $scope.changedTask = {};

    var projectIndex;
    var taskIndex;

    var stages = ["New", "Design", "Code", "Test", "Deploy", "Done", "Finish"];

    $scope.types = {
      "User Story": "user-story",
      "Defect": "defect",
      "Task": "task",
      "Feature": "feature"
    };

    $scope.priorities = {
      "Critical": 1,
      "High": 2,
      "Medium": 3,
      "Low": 4
    };

    $scope.showProject = function(index) {
      getProject(index);
    };

    var getProject = function(index) {
      ProjectsService.getProject($scope.projects[index]._id).then(function (project) {
        $scope.projects[index] = project;
        $scope.currentProject = $scope.projects[index];
      });
    };

    $scope.createProject = function() {
      $scope.createdProject.user_id = $scope.user._id;
      $scope.projects.push($scope.createdProject);

      addProject($scope.projects.length - 1);

      $scope.createdProject = { tasks: [] };
      $scope.currentProject = $scope.projects[$scope.projects.length - 1];

      $scope.createProjectForm.$setPristine();
      $scope.createProjectForm.name.$setUntouched();
      $scope.createProjectForm.desc.$setUntouched();
      $("#createProjectModal").modal('hide');
    };

    var addProject = function(index) {
      ProjectsService.addProject($scope.projects[index]).then(function (project_id) {
        $scope.projects[index]._id = project_id;
      });
    };

    $scope.openMenu = function() {
      $scope.currentProject = null;
    };

    $scope.removeTask = function(index) {
      deleteTask(index);

      $scope.currentProject.tasks.splice(index, 1);
    };

    var deleteTask = function(index) {
      ProjectsService.deleteTask($scope.currentProject.tasks[index]._id);
    };

    $scope.transferTask = function(index) {
      $scope.currentProject.tasks[index].stage = stages[stages.indexOf($scope.currentProject.tasks[index].stage) + 1];

      editTask(index);
    };

    $scope.changeTask = function() {
      $scope.currentProject.tasks[taskIndex] = $scope.changedTask;

      editTask(taskIndex);

      $scope.changedTask = {};
      taskIndex = null;

      $scope.changeTaskForm.$setPristine();
      $scope.changeTaskForm.desc.$setUntouched();
      $scope.changeTaskForm.type.$setUntouched();
      $scope.changeTaskForm.priority.$setUntouched();
      $scope.changeTaskForm.date.$setUntouched();
      $('#changeTaskModal').modal('hide');
    };

    var editTask = function(index) {
      ProjectsService.editTask($scope.currentProject.tasks[index]);
    };

    $scope.declineTask = function(index) {
      $scope.currentProject.tasks[index].stage = "New";
    };

    $scope.changeCurrentTask = function(index) {
      $scope.changedTask = angular.copy($scope.currentProject.tasks[index]);
      taskIndex = index;
    };

    $scope.setCreatedTaskDateToday = function() {
      $scope.createdTask.date = new Date();
    };

    $scope.clearCreatedTaskDate = function() {
      $scope.createdTask.date = null;
    };

    $scope.setChangedTaskDateToday = function() {
      $scope.changedTask.date = new Date();
    };

    $scope.clearChangedTaskDate = function() {
      $scope.changedTask.date = null;
    };

    $scope.options = {
      minDate: new Date()
    };

    $scope.removeProject = function($event, index) {
      $event.stopPropagation();

      deleteProject(index);

      $scope.projects.splice(index, 1);
    };

    var deleteProject = function(index) {
      ProjectsService.deleteProject($scope.projects[index]._id);
    };

    $scope.changeCurrentProject = function($event, index) {
      $event.stopPropagation();

      $scope.changedProject = angular.copy($scope.projects[index]);
      projectIndex = index;

      $("#changeProjectModal").modal('show');
    };

    $scope.changeProject = function() {
      $scope.projects[projectIndex] = $scope.changedProject;

      editProject(projectIndex);

      $scope.changedProject = {};
      projectIndex = null;

      $scope.changeProjectForm.$setPristine();
      $scope.changeProjectForm.name.$setUntouched();
      $scope.changeProjectForm.desc.$setUntouched();
      $("#changeProjectModal").modal('hide');
    };

    var editProject = function(index) {
      ProjectsService.editProject($scope.projects[index]);
    };

    $scope.createTask = function() {
      $scope.createdTask.stage = "New";
      $scope.createdTask.project_id = $scope.currentProject._id;
      $scope.currentProject.tasks.push($scope.createdTask);

      addTask($scope.currentProject.tasks.length - 1);

      $scope.createdTask = {};

      $scope.createTaskForm.$setPristine();
      $scope.createTaskForm.desc.$setUntouched();
      $scope.createTaskForm.type.$setUntouched();
      $scope.createTaskForm.priority.$setUntouched();
      $scope.createTaskForm.date.$setUntouched();
      $('#createTaskModal').modal('hide');
    };

    var addTask = function(index) {
      ProjectsService.addTask($scope.currentProject.tasks[index]).then(function (results) {
        $scope.currentProject.tasks[index]._id = results;
      });
    };

    $scope.isStageEmpty = function(stage) {
      for (var i = 0; i < $scope.currentProject.tasks.length; i++) {
        if ($scope.currentProject.tasks[i].stage === stage) {
          return false;
        }
      }
      return true;
    };

    $scope.user = UserProjectsService.getUser();

    $scope.logout = function() {
      UserProjectsService.cleanUser();
      $location.path("/login");
    };

    ($scope.getProjects = function() {
      ProjectsService.getProjects($scope.user._id).then(function (results) {
        $scope.projects = results;
      });
    }());
}]);
