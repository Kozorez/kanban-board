angular.module('KanbanBoardServices').factory('UserProjectsService', function UserProjectsService() {
  var user = {};

  return {
    getUser: function () {
      return user;
    },
    setUser: function (_id, username) {
      user._id = _id;
      user.username = username;
    },
    cleanUser: function () {
      user = {};
    }
  };
});
