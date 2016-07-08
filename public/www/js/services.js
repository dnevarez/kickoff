angular.module('planner.services', [])

.factory('Chats', function() {

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

  var hours = [{hour: 6, time: 'am'}, {hour: 7, time: 'am'}, {hour: 8, time: 'am'}, {hour: 9, time: 'am'}, {hour: 10, time: 'am'},
    {hour: 11, time: 'am'}, {hour: 12, time: 'pm'}, {hour: 1, time: 'pm'}, {hour: 2, time: 'pm'}, {hour: 3, time: 'pm'}, {hour: 4, time: 'pm'},
    {hour: 5, time: 'pm'}, {hour: 6, time: 'pm'}, {hour: 7, time: 'pm'}, {hour: 8, time: 'pm'}, {hour: 9, time: 'pm'}]


  return {
    hours: function() {
      return hours
    }
  };

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

  var date = new Date(); // Gets full date - GMT
  var dayDate = date.getDate(); // Gets the today's actual date (not weekday number)
  var month = date.getMonth(); // Gets month 0-11
  var year = date.getFullYear(); // Gets year
  var searchDate = month.toString() + dayDate.toString() + year.toString();

  this.addOrUpdateEvent = function (plan, hour, ampm, date, _id) {
    var newEvent= {}
    newEvent.start = hour;
    newEvent.ampm = ampm;
    newEvent.plan = plan;
    newEvent.date = date;
    newEvent.searchDate = newEvent.date.month.toString() + newEvent.date.day.toString() + newEvent.date.year.toString()
    console.log('Service api call', _id)
    if(!_id) {
      return $http({
        method: 'POST',
        url: 'http://localhost:3000/event/',
        data: newEvent
      }).success(function(response){
        console.log(response)
      return response.data;
    })
  } else {
      return $http({
        method: 'PUT',
        url: 'http://localhost:3000/event/' + _id,
        data: newEvent
      }).success(function(response){
        console.log(response)
      // return response.data;
    })
  }
}

  this.updateView = function() {
    return $http({
      method: "GET",
      url: 'http://localhost:3000/event/' + searchDate
    }).then(function(response){
      return response.data;
    })
  }

  this.getPlans = function () {
    return  $http({
      method: "GET",
      url: 'http://localhost:3000/event/' + searchDate
    }).then(function(data) {
      // console.log(data.data)
      return $q.when(data.data)
    })
  }

  this.getDayView = function (search_date) {
    return $http({
      method: 'GET',
      url: 'http://localhost:3000/event/' + search_date
    }).then(function(response) {
      console.log(response.data)
      return response.data;
    })
  }


  this.delete = function (_id) {
    return $http({
      method: "DELETE",
      url: 'http://localhost:3000/event/' + _id
    }).then(function(response){
      console.log(response)
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

    var monthsAbrv = ['Jan', 'Feb', 'Mar', 'Apr',
    'May', 'June', 'July', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'];

    // months[month] + ' ' + dayDate + ' ' + year - example: June 30 2016
    // month + ' ' + dayDate + ' ' + year - example: 6 30 2016
    var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur','Fri','Sat']


    return {
      date: function () {
        return date;
      },

      day: function () {
        return day;
      },

      dayDate: function() {
        return dayDate;
      },

      weekday: function() {
        for (var i = 0; i < weekdays.length; i++){
          if (day === weekdays[i]) {
            console.log(weekdays[i])
            return weekdays[i]
          }
        }
      },

      monthName: function () {
        for (var i = 0; i < months.length; i++) {
          if (i === month) {
            console.log('svc',months[i])
            var monthName = months[i];
          }
        }
        return monthName;
      },

      monthAbr: function() {
            return monthsAbrv
      },

      month: function() {
        return month;
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
      //
      // highlightDay: function(weeks) {
      //   for(var i = 0; i < weeks.length; i++) {
      //     for (var j = 0; j < weeks[i].length; j++) {
      //       if (weeks[i][j] === dayDate) {
      //         weeks[i][j].addclass('')
      //       }
      //     }
      //   }
      // }
  }
})

.service('dayViewObj', function() {

    var myObj;

    this.setObj = function (response) {
      myObj = response;
      return myObj;
      console.log('myObj is ',myObj)
    }

    this.getObj = function () {
      return myObj;
    }
})
