angular.module('planner.controllers', [])

.controller('LoginCtrl', function($scope, loginSvc) {
  $scope.login = loginSvc.login();
  $scope.register = false;

    $scope.show = function (){
    $scope.register = true;
  }

  // $scope.user =



})

.controller('DashCtrl', function($scope, hoursSvc, $ionicModal) {
  $scope.amhours = hoursSvc.am();
  $scope.pmhours = hoursSvc.pm();

  $scope.add = function() {
    console.log($scope.plan)
  }

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    id: '1',
    scope: $scope,
    animation: 'scale-in'
  }).then(function(modal) {
    $scope.modal = modal;
  });
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
