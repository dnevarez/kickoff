// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
// var cal = require(['angular-ios-calendar'], function(res){ return res});
var ngModule = angular.module('planner', ['ionic','ngStorage', 'planner.controllers', 'planner.services'])

// ngModule.constant('moment', require('moment-timezone'))


.run(function($ionicPlatform, $rootScope, $location, $http, $localStorage) {
  $http.defaults.headers.common.Authorization = $localStorage.token;
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$routeChangeStart', function(event) {
    if ($localStorage !== undefined) Auth.isLoggedIn() = true;
    if (!Auth.isLoggedIn()) {
      event.preventDefault();
      $location.path('/login')
    } else {
      $location.path('/tab/dash')
    }
  })
})

// .run(function(amMoment) {
//     amMoment.changeLocale('de');
// })

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('signin', {
     url: '/login',
     templateUrl: 'templates/login.html',
     controller: 'LoginCtrl'
   })

   .state('dayview', {
     url: '/dayview/?first=day&second=search_date',
     templateUrl: 'templates/dayTemp.html',
     controller: 'dayViewCtrl',
     resolve: {
      //  daysEvents: function(planSvc) {
      //   //  console.log(planSvc.getPlans())
      //    return planSvc.getPlans()
      //  }
     }
   })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    },
    resolve: {
      // daysEvents: function(planSvc) {
      // //   console.log(planSvc.getPlans())
      //   return planSvc.getPlans()
      // }
      // userInfoTest: function(userService) {
      //   console.log(userService.getUserInfo())
      //   userService.getUserInfo();
      // }
  }
})

  .state('tab.event', {
    url: '/event',
    views: {
      'tab-event': {
        templateUrl: 'templates/tab-event.html',
        controller: 'DashCtrl'
      }
    }
  })


  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/calendar.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

  // reroute back to signin if no token.

  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        // config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    // console.log('headers fired');
                    // console.log(config.headers.Authorization)
                    return config;
                }
                // 'responseError': function(response) {
                //     if(response.status === 401 || response.status === 403) {
                //         $location.path('/login');
                //     }
                //     console.log(response)
                //     return $q.reject(response);
                // }
            };
        }]);

});
