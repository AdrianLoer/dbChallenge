angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, MapService, GPSService) {
	$scope.startGPS = function() {
		console.log("controller start");
		GPSService.start();
	}

	MapService.init();
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
