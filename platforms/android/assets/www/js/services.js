angular.module('starter.services', [])
  .service('authenService', function ($http, $q, config) {
    this.getUser = function () {
      return (window.localStorage.user) ? JSON.parse(window.localStorage.user) : null;
    };

    this.signin = function (data) {
      var dfd = $q.defer();
      $http.post(config.apiUrl + 'api/auth/signin', data).success(function (data) {
        window.localStorage.setItem('user', JSON.stringify(data));
        dfd.resolve(data);
      }).error(function (err) {
        dfd.reject(err);
      })
      return dfd.promise;
    }

    this.signout = function () {

      window.localStorage.removeItem('user');
      return true;

    };

    this.getusers = function () {
      var dfd = $q.defer();
      var user = this.getUser();
      $http.get(config.apiUrl + 'api/users').success(function (data) {
        // window.localStorage.setItem("storage", JSON.stringify(data));
        dfd.resolve(data);
      }).error(function (err) {
        dfd.reject(err);
      })
      return dfd.promise;
    }



  })

  .service('roomService', function ($http, $q, config) {
    this.getrooms = function () {
      var dfd = $q.defer();
      var user = (window.localStorage.user) ? JSON.parse(window.localStorage.user) : null;
      $http.get(config.apiUrl + 'api/chatrooms', user).success(function (data) {
        // window.localStorage.setItem("storage", JSON.stringify(data));
        dfd.resolve(data);
      }).error(function (err) {
        dfd.reject(err);
      })
      return dfd.promise;
    };

    this.getRoom = function (roomId) {
      var dfd = $q.defer();
      $http.get(config.apiUrl + 'api/chatrooms/' + roomId).success(function (database) {
        dfd.resolve(database);
      });
      return dfd.promise;
    };

    this.createRoom = function (data) {
      var dfd = $q.defer();
      $http.post(config.apiUrl + 'api/chatrooms', data).success(function (data) {
        dfd.resolve(data);
      }).error(function (err) {
        dfd.reject(err);
      })
      return dfd.promise;
    };
  })


  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
      }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
      }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
      }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
      }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  })

  .factory('Socket', function ($rootScope, config) {

    var url = config.apiUrl;
    var socket = io.connect(url);
    return {
      connect: function () {
        io.connect(url);
      },
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      },
      removeAllListeners: function (eventName, callback) {
        socket.removeAllListeners(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      }
    };
  });
