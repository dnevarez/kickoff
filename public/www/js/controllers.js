angular.module('planner.controllers', [])
// Controller for login/signup page.
.controller('LoginCtrl', function($scope, $http, $location, $localStorage, $rootScope, loginSvc, planSvc, dateGetter) {


 $scope.user;
 $scope.password

// Login returns user info and assigned token. Error will pop up if user is not found.
  $scope.login = function(user) {
      // user.searchDate = dateGetter.todaysSearchDate();
      loginSvc.login(user).then(function(res) {
        console.log(res)
        console.log('user is ',user)
        user.username = ''
        user.password = ''
        console.log($scope.user)
      if (!res.data.token && res.data.success === false) {
        $scope.error = res.data.message
        // console.log(1, res)
          // alert(res.data)
      }
      // else if (!res.data.token){
      //   console.log(res.data.message)
      //   $scope.error = res.data.message
      // }

      else {
        // console.log(2, res)
        $localStorage.token = res.data.token;
        $localStorage.userId = res.data.user._id;
        return res
      }
      }, function() {
          $rootScope.error = 'Failed to signin';
    }).then(function(res){
      if (res === undefined){}
      else{
      $scope.searchDate = dateGetter.todaysSearchDate();
      var plan = res.data.user.plan
      planSvc.getPlans(res.data.user._id)
      .then(function(response){
        console.log(response)
        $localStorage.plans = response
        window.location = "/#/tab/dash";

      // for (var i = 0; i < response.length; i++) {
      //   for (var j = 0; j < $scope.hours.length; j++) {
      //     // console.log(response[i], $scope.hours[j]);
      //     if (response[i].start === $scope.hours[j].hour && response[i].ampm === $scope.hours[j].time) {
      //       $scope.hours[j].plan = response[i].plan
      //       $scope.hours[j]._id = response[i]._id
      //       console.log($scope.hours[j], $scope.hours[j].plan, $scope.hours[j]._id)
      //     }
      //   }
      // }
      })
    }
    })
    }

// Register new user. Sends info to database,
  $scope.create = function(user, password) {
    // console.log("ctrl ",user, password)
    loginSvc.signUp(user, password).then( function(res) {
      if (res.data.token) {
        $localStorage.token = res.data.token;
        window.location = "/#/tab/dash"
      } else {
        window.location = '/'
      }
    }, function() {
          $rootScope.error = 'Failed to signup. All fields required';
    });
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
  $ionicListDelegate, planSvc, dateGetter, $state, loginSvc, $localStorage, $rootScope) {
// console.log(loginSvc.data)
  // Hours months and date object, passed to view in order to be submitted with user
  // info for database.
  var plans = $localStorage.plans
  $scope.hours = hoursSvc.hours();
  $scope.month = dateGetter.monthName();
  $scope.da = {month: dateGetter.month(), day: dateGetter.dayDate(), year: dateGetter.year()}
  $scope.searchTodaysDate = dateGetter.todaysSearchDate();


  $scope.doRefresh = function() {
    planSvc.updateView()
     .then(function(plans) {
      //  $localStorage.plans = plans
       window.location.reload();
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };

  // Open modal and pass it the required data needed by database.

  $scope.openModal = function(plan) {

    console.log(plan)
         $scope.modal_id = plan._id;
         $scope.modaldate = plan.date;
         $scope.modalhour = plan.hour;
         $scope.modalplan = plan.plan;
         $scope.modalampm = plan.ampm
         $scope.modal.show();
       };

    // Add or update an event in the database.

  $scope.add = function(plan, hour, ampm, date, _id) {
    // console.log('id is ', _id)
    // console.log('add',plan, hour, ampm, date)
    planSvc.addOrUpdateEvent(plan, hour, ampm, date, _id).then(function() {
      planSvc.getPlans()
      .then(function(response) {
        $scope.modalplan = ' '
        console.log(response)
        console.log($scope.modalplan)
      for (var i = 0; i < plans.length; i++) {
        for (var j = 0; j < $scope.hours.length; j++) {
          // console.log(response[i], $scope.hours[j]);
          if (plans[i].start === $scope.hours[j].hour && plans[i].ampm === $scope.hours[j].time && plans[i].searchDate == $scope.searchTodaysDate) {
            $scope.hours[j].plan = plans[i].plan
            $scope.hours[j]._id = plans[i]._id
            console.log($scope.hours[j], $scope.hours[j].plan, $scope.hours[j]._id)
          }
        }
      }
      // $window.location.reload();
    })
      // $state.go($state.current, {}, {reload: true});

    })
    $ionicListDelegate.closeOptionButtons();
    $scope.modal.hide();
  }

  // Delete event in the database.

  $scope.delete = function(_id, plan) {
    // if ($scope.hours.plan === plan) {
    //   $scope.hours.plan = ''
    // };
    planSvc.delete(_id).then(function(res){

        $localStorage.plans;
        // var plans = response
        for (var i = 0; i < $localStorage.plans.length; i++) {
          for (var j = 0; j < $scope.hours.length; j++) {
            // console.log(response[i], $scope.hours[j]);
            if ($localStorage.plans[i].start === $scope.hours[j].hour && $localStorage.plans[i].ampm === $scope.hours[j].time && $localStorage.plans[i].searchDate == $scope.searchTodaysDate) {
              $scope.hours[j].plan = $localStorage.plans[i].plan
              $scope.hours[j]._id = $localStorage.plans[i]._id
              // console.log($scope.hours[j], $scope.hours[j].plan, $scope.hours[j]._id)
            }
          }
        }
        // $ionicListDelegate.update();
      $ionicListDelegate.closeOptionButtons();
      })
      // $window.location.reload();
    }

    $scope.hideEdit= function(){
      $ionicListDelegate.closeOptionButtons();
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

  if (!$localStorage) {
    window.location = '/#/login'
  }


  // Plan
  // Matches plan to proper hour(am/pm) for today.
  var plans = $localStorage.plans

  console.log($scope.searchTodaysDate)
// $rootScope.$on('updateEvents', function(){
  if (!plans){
    window.location = "/#/login"
    $scope.hours = hoursSvc.hours();
  }
  for (var i = 0; i < plans.length; i++) {
    for (var j = 0; j < $scope.hours.length; j++) {
      // console.log(plans[i].searchDate, $scope.searchTodaysDate);
      if (plans[i].start === $scope.hours[j].hour && plans[i].ampm === $scope.hours[j].time && plans[i].searchDate == $scope.searchTodaysDate) {
        $scope.hours[j].plan = plans[i].plan
        $scope.hours[j]._id = plans[i]._id
        console.log($scope.hours[j].plan, $scope.hours[j]._id)
      }
    }
  }
  // })


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

.controller('dayViewCtrl', function($scope, $stateParams, hoursSvc, $localStorage, $ionicModal, planSvc,
  dateGetter, dayViewObj) {
  $scope.hours = hoursSvc.hours();
  $scope.monthsAbr = dateGetter.monthAbr();

  $scope.weekdays = dateGetter.weekdays();

  let dayViewEvents2 = dayViewObj.getObj();
  console.log(dayViewEvents2)



  console.log($scope.monthsAbr)
  // $scope.end = hour

  $scope.openModal = function(plan, hour, ampm, date, _id) {
    $scope.modal_id = _id;
    $scope.modaldate = date;
    $scope.modalhour = hour;
    $scope.modalplan = plan;
    $scope.modalampm = ampm
         $scope.modal.show();
       };
  // console.log(today)
  $scope.add = function(plan, hour) {
    console.log(plan, hour)
    planSvc.addOrUpdateEvent(plan, hour);
  }

  // Gets month and year for dayTemp view
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
    let index = dayViewEvents2.idx

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
        for (let i = 0; i < $scope.weekdays.length; i++){
          if (index === i) {
            $scope.dayviewDay = $scope.weekdays[i]
          }
        }
        return $scope.heading = $scope.dayviewDay + ' ' + $scope.monthAbr + ' ' + $scope.thisDay + ', ' + $scope.year
    }();



  var hour = function() {
    let date = new Date();
    let hour = date.getHours();
    // console.log(hour)
  }

  // Plan

  var getDayViewEvents = function () {
    let dayViewEvents = dayViewObj.getObj();
    console.log(dayViewEvents)
    let searchd = dayViewEvents.search_date;
    console.log(dayViewEvents.plans)
    for (let i = 0; i < dayViewEvents.plans.length; i++){
      if (dayViewEvents.plans[i].search_date === searchd) {
        console.log(dayViewEvents.plans[i])
        $scope.modalplan = dayViewEvents.plans[i].plan
        $scope.modal_id = dayViewEvents.plans[i]._id
        $scope.modalhour = dayViewEvents.plans[i].hour
      }
    }
    // for (var i = 0; i < dayViewEvents2.length; i++) {
    //   for (var j = 0; j < $scope.thishours.length; j++) {
    //     // console.log(daysEvents[i]._id, $scope.hours[j])
    //     if (dayViewEvents[i].start === $scope.thishours[j].hour && dayViewEvents2[i].ampm === $scope.thishours[j].time) {
    //       $scope.thishours[j].plan = dayViewEvents2[i].plan
    //       $scope.thishours[j]._id = dayViewEvents2[i]._id
    //       // $scope.hours[j].hour = dayViewEvents2[i].start
    //       console.log($scope.hours[j].plan, $scope.hours[j]._id, $scope.hours[j].time)
    //     }
    //   }
    // }
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




.controller('ChatsCtrl', function($scope, $filter, $ionicModal, dateGetter, $state, hoursSvc, planSvc, $localStorage, dayViewObj) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.thours = hoursSvc.hours()

  $scope.month = dateGetter.monthName();
  var month2 = dateGetter.month();
  $scope.year = dateGetter.year();
  // console.log($scope.month)
  $scope.days = dateGetter.monthLength();
  // console.log($scope.days)
  $scope.getDays = function(days) {
    return new Array(days);
  }
  var days = $scope.getDays($scope.days);
  // console.log($scope.days);
$scope.add = function (date, plan, time){
  console.log(date)
  var planObj ={}
  planObj.date = {}
  planObj.date.year = $filter('date')(date, "yyyy");
  planObj.date.day = $filter('date')(date, "d");
  planObj.date.month = $filter('date')(date, "M");
  planObj.hour = $filter('date')(time, 'h')
  planObj.ampm = $filter('date')(time, "a");

  planObj.plan = plan

  var searchDate = (planObj.date.month) + planObj.date.day + planObj.date.year
  console.log(searchDate)
  planObj.searchDate = searchDate

  planSvc.addOrUpdateEvent(planObj.plan, planObj.hour, planObj.ampm, planObj.date, planObj.searchDate)
  .then(function(response){
    // console.log(response)
    $localStorage.plans.push(response)
  })
  $scope.thisdayview = false;
}

$scope.weeks = dateGetter.calDays();

$scope.weekdays = dateGetter.weekdays();

// console.log(dateGetter.calDays())

$scope.planner =  function(Day){
  $scope.searchDate = month2.toString() + Day + $scope.year.toString();
  var viewDayNum = Day + 1
  var backdate = $scope.year.toString() + '0'+ month2.toString() + viewDayNum;
  console.log(backdate)
  var pattern = /(\d{4})(\d{2})(\d{2})/;
  $scope.date = new Date(backdate.replace(pattern, '$1-$2-$3'))
  console.log($scope.date)

  for (var i = 0; i < $localStorage.plans.length; i++) {
    if ($localStorage.plans[i].searchDate === $scope.searchDate) {
      $scope.hour.plan = $localStorage.plans[i].plan
      console.log($scope.hours.plan)
       console.log($localStorage.plans[i])

    }
  }
  $scope.thisdayview = true

}

$scope.view = function(search) {
  console.log(search)
  for (var i = 0; i < $localStorage.plans.length; i++){
    if($localStorage.plans[i].searchDate === search){
      console.log($localStorage.plans[i])

    }
    $scope.modal.show(2)
  }
}

$scope.back = function () {
  window.location = '/#/tab/chats'
  window.location.reload()
}

$ionicModal.fromTemplateUrl('templates/modal2.html', {
  id: '2',
  scope: $scope,
  animation: 'scale-in'
}).then(function(modal) {
  $scope.modal = modal;
});

// $scope.planner = function(Day, month, index) {
//   console.log(Day, month, index)
//   let monthAbrs = dateGetter.monthAbr();
//   let year = dateGetter.year();
//   let monthNum;
//   let thedayplans = []
//   console.log(monthAbrs, year)
//     for (let i = 0; i < monthAbrs.length; i++) {
//       if (monthAbrs[i] === month){
//         monthNum = i;
//         console.log(monthNum);
//         $scope.monthNum = monthNum
//         console.log($scope.monthNum)
//       }
//   }
//   console.log($scope.weekdays)
//   for (let i = 0; i < $scope.weekdays.length; i++){
//     if (index === i) {
//       $scope.dayviewDay = $scope.weekdays[i]
//     }
//   }
//   let search_date = $scope.monthNum.toString() + Day.toString() + year.toString();
//   for (var i = 0; i < $localStorage.plans.length; i++){
//     if (search_date == $localStorage.plans[i].searchDate){
  //     thedayplans.push($localStorage.plans[i])
  //   }
  // }
  // $scope.heading = $scope.dayviewDay + ' ' + $scope.monthAbr + ' ' + $scope.thisDay + ', ' + $scope.year
  // console.log(search_date)
  //
  // $scope.thisdayview = true
  // // planSvc.getDayView(search_date).then(function(response){
  //     dayViewObj.setObj({day: Day, search_date: search_date, idx: index, plans: thedayplans});
  //     // $state.go("dayview", {day: Day, search_date: search_date, idx: index, plans: thedayplans})
  //   }



// for ( var i = 0; i < $localStorage.plan.length; i++) {
//   // if ($localStorage.plan[i].searchDate == )
//   $scope.day.plan = $localStorage.plan
// }



// console.log(days)



  // $scope.chats = Chats.all();
  // $scope.remove = function(chat) {
  //   Chats.remove(chat);
  // };
})

.controller('daygetter', function($scope, $stateParams, daysEvents, planSvc) {





 })

.controller('AccountCtrl', function($scope, loginSvc) {
  $scope.logout = function() {
    loginSvc.logout();
  }
});
