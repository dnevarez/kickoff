angular.module('planner.services', [])

.factory('Chats', function() {
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
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('hoursSvc',function($http){

  var hours = [{hour: 6}, {hour: 7}, {hour: 8}, {hour: 9}, {hour: 10},
    {hour: 11}, {hour: 12}, {hour: 1}, {hour: 2}, {hour: 3}, {hour: 4},
    {hour: 5}, {hour: 6}, {hour: 7}, {hour: 8}, {hour: 9}]


  return {
    hours: function() {
      return hours
    },


    // edit: function () {
    //   $http({
    //     method: "POST",
    //     url: "/api/day"
    //   })
    // }
  }
})

.factory('loginSvc', function($http, $location) {
  return {

    login: function(user) {
      console.log("login",user.username)
      $http({
        method: "GET",
        url: "http://localhost:3000/login/" + user.username
        // data: user.username
      }).then(function(response){
        console.log(response)
        console.log(response.data[0])
        if (response.data[0].password === user.password && response.data[0].username === user.username) {
          $location.path('#/tab/dash')
        } else {
          alert('Either username or password did not match')
        }
      })
    },

    signUp: function(user, password) {
      console.log("user is ",user);

      if (user.password !== password) {
        alert('Passwords must match');
      }
       $http({
      method: "POST",
      url: "http://localhost:3000/signup",
      data: user
    }).then(function(response) {
      console.log(response)
    })
    }

  }
})

.service('userService', function ($http, $q, $location) {

  this.getUserInfo = function() {

   return $http({
     method: "GET",
     url: '/signup/' + user.username,
   })
   .then(function(response) {
     console.log(response)
    //  if(!response) $location.path('/login');
     return $q.when(response.data.name);
   })
 }
})

.service('planSvc', function($http, $q) {

  this.addEvent = function (plan, hour) {
    event.start = hour;
    event.plan = plan;
    console.log(event.plan, event.start)
    // return $http({
    //   method: 'POST',
    //   url: 'http://localhost:3000/event/',
    //   data: event
    // }).success(function(response){
  //   return response.data;
  // })
  }

  this.getPlans = function () {
    return  $http({
      method: "GET",
      url: 'http://localhost:3000/event/' + 752016
    }).then(function(data) {
      console.log(data.data)
      return $q.when(data.data)
    })
  }

})

.factory('dateGetter', function() {

    var date = new Date(); // Gets full date - GMT
    var day = date.getDay(); // Gets weekday number. 0-6 ie - Sunday is 0, Thursday is 5
    var dayDate = date.getDate(); // Gets the today's actual date (not weekday number)
    var month = date.getMonth(); // Gets month 0-11
    var year = date.getFullYear(); // Gets year

    var monthStart = new Date(year, month, 1); //gets first day of current month
    var monthEnd = new Date(year, month + 1, 1); //gets last day of current month
    var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24) //gets length of current month

    // var firstDay = monthStart.getDay(); // Gets weekday number for first day of the month

    var startDay = monthStart.getDay(); // Gets weekday number for first day of the month

    // console.log('service', firstDay)
    var months = ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];

    // months[month] + ' ' + dayDate + ' ' + year - example: June 30 2016
    // month + ' ' + dayDate + ' ' + year - example: 6 30 2016



    return {
      date: function () {
        return date;
      },

      day: function () {
        return day;
      },

      month: function () {
        for (var i = 0; i < months.length; i++) {
          if (i === month) {
            console.log('svc',months[i])
            var monthName = months[i];
          }
        }
        return monthName;
      },

      year: function () {
        return year;
      },

      monthLength: function () {
        return monthLength;
      },

      calDays: function() {
        var weeks = [];
        var numWeeks = (monthLength + startDay) / 7
        for (var i = 0; i <= numWeeks; i++ ) {
         weeks[i] = [];
           for(var j = 0; j < 7; j++){
             if(i == 0 && j < startDay){
            weeks[i].push(' ');
             } else{
               var day = (j - startDay + 1) + (i * 7);
           // console.log(day)
               weeks[i].push(day<=monthLength ? day : ' ');
             }
          }
        }
        return weeks;
      }
  }
})
