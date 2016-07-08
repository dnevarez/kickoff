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

.controller('DashCtrl', function($scope, $window, $http, hoursSvc, $ionicModal,
  $ionicListDelegate, planSvc, daysEvents, dateGetter, $state) {

  // Hours months and date object, passed to view in order to be submitted with user
  // info for database.

  $scope.hours = hoursSvc.hours();
  $scope.month = dateGetter.monthName();
  $scope.da = {month: dateGetter.month(), day: dateGetter.dayDate(), year: dateGetter.year()}

  // Open modal and pass it the required data needed by database.

  $scope.openModal = function(plan) {
    console.log(plan)
    // console.log(hour, plan, ampm, date)
         $scope._id = plan._id;
         $scope.date = plan.date;
         $scope.hour = plan.hour;
         $scope.plan = plan.plan;
         $scope.ampm = plan.ampm
         $scope.modal.show();
       };

    // Add or update an event in the database.

  $scope.add = function(plan, hour, ampm, date, _id) {
    // console.log('id is ', _id)
    // console.log('add',plan, hour, ampm, date)
    planSvc.addOrUpdateEvent(plan, hour, ampm, date, _id).then(function() {
      planSvc.getPlans()
      .then(function(response) {
        // console.log(response)
      for (var i = 0; i < response.length; i++) {
        for (var j = 0; j < $scope.hours.length; j++) {
          // console.log(response[i], $scope.hours[j]);
          if (response[i].start === $scope.hours[j].hour && response[i].ampm === $scope.hours[j].time) {
            $scope.hours[j].plan = response[i].plan
            $scope.hours[j]._id = response[i]._id
            console.log($scope.hours[j], $scope.hours[j].plan, $scope.hours[j]._id)
          }
        }
      }
      $window.location.reload();
    })
      // $state.go($state.current, {}, {reload: true});

    })
    $scope.modal.hide();
  }

  // Delete event in the database.

  $scope.delete = function(_id) {
    planSvc.delete(_id).then(function(res){
      planSvc.updateView()
      .then(function(response) {
        console.log(response)
        for (var i = 0; i < response.length; i++) {
          for (var j = 0; j < $scope.hours.length; j++) {
            // console.log(response[i], $scope.hours[j]);
            if (response[i].start === $scope.hours[j].hour && response[i].ampm === $scope.hours[j].time) {
              $scope.hours[j].plan = response[i].plan
              $scope.hours[j]._id = response[i]._id
              console.log($scope.hours[j].plan, $scope.hours[j]._id)
            }
          }
        }
    })
      $ionicListDelegate.closeOptionButtons();
      $window.location.reload();
      })

  }

  // Give the weekday name to number retrieved from getDay function.

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



  // Plan
  // Matches plan to proper hour(am/pm).

  for (var i = 0; i < daysEvents.length; i++) {
    for (var j = 0; j < $scope.hours.length; j++) {
      // console.log(daysEvents[i], $scope.hours[j];
      if (daysEvents[i].start === $scope.hours[j].hour && daysEvents[i].ampm === $scope.hours[j].time) {
        $scope.hours[j].plan = daysEvents[i].plan
        $scope.hours[j]._id = daysEvents[i]._id
        console.log($scope.hours[j].plan, $scope.hours[j]._id)
      }
    }
  }


  // (function () { console.log('Dash', daysEvents[0], daysEvents[0].start)})()

  $scope.planner = function(day) {
    console.log(day)
  }




  $ionicModal.fromTemplateUrl('templates/modal.html', {
    id: '1',
    scope: $scope,
    animation: 'scale-in'
  }).then(function(modal) {
    $scope.modal = modal;
  });
})

.controller('dayViewCtrl', function($scope, $stateParams, hoursSvc, $ionicModal, planSvc,
   daysEvents, dateGetter, dayViewObj) {
  $scope.hours = hoursSvc.hours();
  $scope.monthsAbr = dateGetter.monthAbr();



  console.log($scope.monthsAbr)
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


  $scope.m = function() {
    let date = new Date();
    let month = date.getMonth();
     $scope.dayDate = date.getDate();
     $scope.year = date.getFullYear();
    let monthAbrs = dateGetter.monthAbr();
    for (let i = 0; i < monthAbrs.length; i++) {
      if (i === month){
        $scope.monthAbr = monthAbrs[i]
        console.log($scope.monthAbr)
        break;
      }
    }
  }();

  $scope.ph = function() {
    let date = new Date();
    let today = date.getDay();
    $scope.thisDay = $stateParams.day;
    console.log($stateParams.search_date)
    console.log(today)
    let weekda = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
      for (let i = 0; i < weekda.length; i++) {
        // console.log(weekda[i])
        if (i === today){
          // console.log(today)
          $scope.toDay = weekda[i]
          // console.log($scope.toDay)
          }
        }
        return $scope.heading = $scope.toDay + ' ' + $scope.monthAbr + ' ' + $scope.thisDay + ', ' + $scope.year
    }();

  var hour = function() {
    let date = new Date();
    let hour = date.getHours();
    // console.log(hour)
  }

  // Plan

  var dayViewEvents = function () {
    let dayViewEvents = dayViewObj.getObj();
    console.log(dayViewEvents)
    for (var i = 0; i < dayViewEvents.length; i++) {
      for (var j = 0; j < $scope.hours.length; j++) {
        // console.log(daysEvents[i]._id, $scope.hours[j])
        if (dayViewEvents[i].start === $scope.hours[j].hour && dayViewEvents[i].ampm === $scope.hours[j].time) {
          $scope.hours[j].plan = dayViewEvents[i].plan
          $scope.hours[j]._id = dayViewEvents[i]._id
          // $scope.hours[j].hour = dayViewEvents[i].start
          console.log($scope.hours[j].plan, $scope.hours[j]._id, $scope.hours[j].time)
        }
      }
    }
}()


  // (function () { console.log('Dash', daysEvents[0], daysEvents[0]._id)})()



  // $scope.planner = function(event) {
  //   console.log(event)
  // }







  $ionicModal.fromTemplateUrl('templates/modal.html', {
    id: '1',
    scope: $scope,
    animation: 'scale-in'
  }).then(function(modal) {
    $scope.modal = modal;
  });
})




.controller('ChatsCtrl', function($scope, dateGetter, $state, planSvc, dayViewObj) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.month = dateGetter.monthName();
  // console.log($scope.month)

  $scope.days = dateGetter.monthLength();
  // console.log($scope.days)
  $scope.getDays = function(days) {
    return new Array(days);
  }
  var days = $scope.getDays($scope.days);
  // console.log($scope.days);


$scope.weeks = dateGetter.calDays();

// console.log(dateGetter.calDays())

$scope.planner = function(Day, month) {
  console.log(Day, month)
  let monthAbrs = dateGetter.monthAbr();
  let year = dateGetter.year();
  let monthNum;
  console.log(monthAbrs, year)
    for (let i = 0; i < monthAbrs.length; i++) {
      if (monthAbrs[i] === month){
        monthNum = i;
        console.log(monthNum);
        $scope.monthNum = monthNum
        console.log($scope.monthNum)
      }
  }
  let search_date = $scope.monthNum.toString() + Day.toString() + year.toString();
  // console.log(search_date)
  planSvc.getDayView(search_date).then(function(response){
      dayViewObj.setObj(response);
      $state.go("dayview", {day: Day, search_date: search_date})
    })
  }



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
