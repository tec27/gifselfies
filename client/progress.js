// Loosely based on ngProgress, but without all the global state and easily browserifiable
var angular = require('angular')

module.exports = 'gifselfies.progress'
var mod = angular.module(module.exports, [])

mod.directive('gsProgress', function() {
  function link(scope, element, attrs) {
    var container = element.children().eq(0)
      , progressElem = container.children()

    if (scope.color) {
      progressElem.css('background-color', scope.color)
      progressElem.css('color', scope.color)
    }
    if (scope.height !== null && scope.height !== undefined) {
      progressElem.css('height', scope.height)
    }

    scope.$watch('percent', function(newVal) {
      progressElem.css('width', (newVal || 0) + '%')
    })
  }

  return {
    restrict: 'E',
    link: link,
    template: '<div class="gs-progress-container"><div class="gs-progress"></div></div>',
    scope: {
      color: '@',
      height: '@',
      percent: '='
    }
  }
})
