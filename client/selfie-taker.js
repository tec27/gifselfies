var angular = require('angular')
  , AnimatedGif = require('Animated_GIF/src/main')

module.exports = 'gifselfies.selfie-taker'
var mod = angular.module(module.exports, [])

mod.controller('SelfieTakerCtrl', function($scope) {
  var videoElem

  $scope.webcamError = null
  $scope.webcamReady = false

  $scope.$on('gsWebcamError', function(scope, elem, err) {
    $scope.webcamError = err.name
  })
  $scope.$on('gsWebcamReady', function(scope, elem) {
    $scope.webcamReady = true
    videoElem = elem
  })

  $scope.capture = function() {
    // TODO(tec27): capture a gif
  }
})

var getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
var url = window.URL || window.webkitURL || window.mozURL || window.msURL

if (getUserMedia) getUserMedia = getUserMedia.bind(navigator)

mod.directive('gsWebcam', function() {
  function link(scope, element, attrs) {
    if (element.prop('tagName') != 'VIDEO') {
      throw new Error('gsWebcam can only be used on Video elements')
    }
    if (!getUserMedia) {
      return
    }

    // TODO(tec27): make customizable through attributes
    var width = 640
      , height = 480
    getUserMedia({
      video: {
        mandatory: {
          minWidth: width,
          minHeight: height
        }
      }
    }, success, failure)

    function success(stream) {
      var elem = element[0]
      if (elem.mozSrcObject) {
        elem.mozSrcObject = stream
      } else {
        elem.src = url.createObjectURL(stream)
      }

      elem.play()
      scope.$emit('gsWebcamReady', element)
      scope.$apply()
    }

    function failure(err) {
      scope.$emit('gsWebcamError', element, err)
      scope.$apply()
    }
  }

  return {
    restrict: 'A',
    link: link
  }
})
