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
    $scope.user = authenService.getUser();
    $scope.listRoom = function () {
      roomService.getrooms().then(function (res) {
        $scope.chats = res;
      }, function (err) {
        console.log(err);
      });
    };
    $scope.listRoom();
    $scope.createRoom = function (data) {
      roomService.createRoom(data).then(function (res) {
        $scope.listRoom();
      }, function (err) {
        console.log(err);
      });
    };
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats, roomService, Socket, authenService) {
    $scope.user = authenService.getUser();
    var roomId = $stateParams.chatId;
    $scope.messages = [];
    $scope.chat = null;
    Socket.connect();
    // ทดสอบ mobile connect
    // Socket.on('mobile', function (message) {
    //   $scope.messages.unshift(message);
    // });

    roomService.getRoom(roomId).then(function (res) {
      $scope.chat = res;
      var joindata = {
        name: res.name,
        type: res.type,
        users: res.users,
        user: res.user
      };
      // alert('invite : ' + JSON.stringify(data));
      Socket.emit('join', joindata);

    }, function (err) {
      console.log(err);
    });

    // Add an event listener to the 'invite' event
    Socket.on('invite', function (res) {
      var data = {
        name: res.name,
        type: res.type,
        users: res.users,
        user: res.user
      };
      // alert('invite : ' + JSON.stringify(data));
      Socket.emit('join', data);
    });

    // Add an event listener to the 'joinsuccess' event
    Socket.on('joinsuccess', function (data) {
      $scope.room = data;
      // alert('joinsuccess : ' + JSON.stringify(data));
    });

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
    });

    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      $scope.room.user = $scope.user;
      $scope.room.text = this.message;

      Socket.emit('chatMessage', $scope.room);
      this.message = '';
    };
  })

  .controller('AccountCtrl', function ($scope, authenService) {
    $scope.listAccount = function () {
      authenService.getusers().then(function (res) {
        $scope.accounts = res;
      }, function (err) {
        console.log(err);
      });
    };
    $scope.listAccount();

    $scope.settings = {
      enableFriends: true
    };
  });
