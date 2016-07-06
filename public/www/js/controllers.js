angular.module('planner.controllers', [])

.controller('LoginCtrl', function($scope, loginSvc) {
  $scope.user;
  $scope.password;

  $scope.login = function(user) {
    loginSvc.login(user);
  }

  $scope.create = function(user, password) {
    console.log("ctrl ",user, password)
    loginSvc.signUp(user, password);
  }

  $scope.register = false;

    $scope.show = function (){
    $scope.register = true;
    $scope.cancel = true;
  }

  $scope.canc = function() {
    $scope.register = false;
    $scope.cancel = false;
  }

  // $scope.user =



})

.controller('DashCtrl', function($scope, hoursSvc, $ionicModal, planSvc, daysEvents, dateGetter) {
  $scope.hours = hoursSvc.hours();
  $scope.month = dateGetter.month();

  // $scope.end = hour

  $scope.openModal = function(hour, plan) {
         $scope.hour = hour;
         $scope.plan = plan;
         $scope.modal.show();
       };
  // console.log(today)
  $scope.add = function(plan, hour) {
    console.log(plan, hour)
    planSvc.addEvent(plan, hour);
  }

  $scope.g = function() {
    let date = new Date();
    let today = date.getDay();
    let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    for (let i = 0; i < weekday.length; i++) {
      // console.log(weekday[i])
      if (i === today){
        $scope.today = weekday[i]
        // console.log($scope.today)
      }
    }
  }();

  var hour = function() {
    let date = new Date();
    let hour = date.getHours();
    // console.log(hour)
  }

  // Plan

  $scope.th = daysEvents;
  var plan;
  for (var i = 0; i < daysEvents.length; i++) {
    for (var j = 0; j < $scope.hours.length; j++) {
      // console.log(daysEvents[i].start, $scope.hours[j])
      if (daysEvents[i].start === $scope.hours[j].hour) {
        $scope.hours[j].plan = daysEvents[i].plan
        // console.log($scope.hours[j].plan, $scope.hours[j].hour)
      }
    }
  }


  (function () { console.log('Dash', daysEvents[0], daysEvents[0].start)})()

  $scope.planner = function(day, month) {
    console.log(day, month)
  }




  $ionicModal.fromTemplateUrl('templates/modal.html', {
    id: '1',
    scope: $scope,
    animation: 'scale-in'
  }).then(function(modal) {
    $scope.modal = modal;
  });
})

.controller('dayViewCtrl', function($scope, hoursSvc, $ionicModal, planSvc, daysEvents, dateGetter) {
  $scope.hours = hoursSvc.hours();
  $scope.month = dateGetter.month();
  // $scope.end = hour

  $scope.openModal = function(hour, plan) {
         $scope.hour = hour;
         $scope.plan = plan;
         $scope.modal.show();
       };
  // console.log(today)
  $scope.add = function(plan, hour) {
    console.log(plan, hour)
    planSvc.addEvent(plan, hour);
  }

  $scope.g = function() {
    let date = new Date();
    let today = date.getDay();
    let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    for (let i = 0; i < weekday.length; i++) {
      // console.log(weekday[i])
      if (i === today){
        $scope.today = weekday[i]
        // console.log($scope.today)
      }
    }
  }();

  var hour = function() {
    let date = new Date();
    let hour = date.getHours();
    // console.log(hour)
  }

  // Plan

  $scope.th = daysEvents;
  var plan;
  for (var i = 0; i < daysEvents.length; i++) {
    for (var j = 0; j < $scope.hours.length; j++) {
      // console.log(daysEvents[i].start, $scope.hours[j])
      if (daysEvents[i].start === $scope.hours[j].hour) {
        $scope.hours[j].plan = daysEvents[i].plan
        // console.log($scope.hours[j].plan, $scope.hours[j].hour)
      }
    }
  }


  (function () { console.log('Dash', daysEvents[0], daysEvents[0].start)})()



  $scope.planner = function(event) {
    console.log(event)
  }


  $ionicModal.fromTemplateUrl('templates/modal.html', {
    id: '1',
    scope: $scope,
    animation: 'scale-in'
  }).then(function(modal) {
    $scope.modal = modal;
  });
})




.controller('ChatsCtrl', function($scope, dateGetter, planSvc) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.month = dateGetter.month();
  // console.log($scope.month)

  $scope.days = dateGetter.monthLength();
  // console.log($scope.days)
  $scope.getDays = function(days) {
    return new Array(days);
  }
  var days = $scope.getDays($scope.days);
  // console.log($scope.days);

//   (function() {
//   var weeks = [];
//     for (var i = 0; i < $scope.days; i++ ) {
//
//         if (i % 7 == 0) weeks.push([]);
//         weeks[weeks.length-1].push(i + 1);
//     }
//   return $scope.dates = weeks;
// })();

$scope.weeks = dateGetter.calDays();


console.log(dateGetter.calDays())




// console.log(days)



  // $scope.chats = Chats.all();
  // $scope.remove = function(chat) {
  //   Chats.remove(chat);
  // };
})

.controller('daygetter', function($scope, $stateParams, daysEvents, planSvc) {




 })

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
