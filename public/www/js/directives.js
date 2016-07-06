angular.module('planner.directives', [])

.directive('dayDisplay', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/dayTemp.html',
    controller: 'DashCtrl',
    link: function (scope, elem, attrs) {
      console.log(attrs)
    }
  }
})
