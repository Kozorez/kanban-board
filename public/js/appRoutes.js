angular.module('KanbanBoardRoutes', []).config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/projects', {
      templateUrl: 'templates/projects.html',
      controller: 'ProjectsCtrl'
    }).when('/login', {
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    }).when('/register', {
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
    }).otherwise({redirectTo: '/login'});
  }]).run(function ($rootScope, $location, UserProjectsService) {
    $rootScope.$on("$locationChangeStart",function(event, next, current) {
      if (current === "http://localhost:3000/#!/login" && next === "http://localhost:3000/#!/projects") {
        if (!UserProjectsService.getUser()._id) {
          event.preventDefault();
        }
      }
    });
  });
