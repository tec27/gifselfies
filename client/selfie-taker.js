var angular = require('angular')
  , AnimatedGif = require('Animated_GIF/src/main')

module.exports = 'gifselfies.selfie-taker'
var mod = angular.module(module.exports, [])

mod.controller('SelfieTakerCtrl', function($scope) {
})

mod.directive('gsWebcam', function() {
  function link(scope, element, attrs) {
    if (element.prop('tagName') != 'VIDEO') {
      throw new Error('gsWebcam can only be used on Video elements')
    }
  }

  return {
    restrict: 'A',
    link: link
  }
})
