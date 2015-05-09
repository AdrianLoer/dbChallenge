angular.module('starter.controllers', [])

// we dont define the ol3 map here, thats done in the MapService

.controller('MapViewController', function($scope, MapService, CardService, GPSService) {
	console.log("MapViewController loaded");
	MapService.init();

	// $scope.infoCards = [
	// 	{
	// 		title: "title 1",
	// 		description: "description example 1"
	// 	},
	// 	{
	// 		title: "title 2",
	// 		description: "description example 2"
	// 	},
	// 	{
	// 		title: "title 3",
	// 		description: "description example 3"
	// 	}
	// ];

	$scope.infoCards = CardService.getCards;

	$scope.addCard = function() {
		console.log("addCard");
		CardService.addCard({
			title: "title " + $scope.infoCards.length,
			description: "example description " + $scope.infoCards.length++
		})
	}

	$scope.start = function() {
		GPSService.start();
	}

})

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
