angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, authenService, $state) {
    $scope.storage = authenService.getUser();
    $scope.login = function (data) {
      var userlogin = {
        username: data.username,
        password: data.password
      };
      authenService.signin(userlogin).then(function (res) {
        $scope.storage = res;
        // console.log($scope.storage);
        alert('success');
        $state.go('tab.chats');
      }, function (err) {
        console.log(err);
        alert('error : ' + JSON.stringify(err));
      })
    }

    $scope.logout = function () {
      authenService.signout();
      $scope.storage = authenService.getUser();
    }
  })

  .controller('ChatsCtrl', function ($scope, Chats, authenService, roomService) {
    $scope.storage = authenService.getUser();
    roomService.getrooms().then(function (res) {
      $scope.chats = res;
    }, function (err) {
      console.log(err);
    });
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats, roomService, Socket) {
    var roomId = $stateParams.chatId;
    roomService.getRoom(roomId).then(function (res) {
      $scope.chat = res;
    }, function (err) {
      console.log(err);
    });

    Socket.on('invite', function (data) {
      alert('invite' + JSON.stringify(message));
      Socket.emit('join', data);
    });

    Socket.on('joinsuccess', function (data) {
      $scope.room = data;
      alert('joinsuccess : ' + JSON.stringify(data));
    });

    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
    });
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });