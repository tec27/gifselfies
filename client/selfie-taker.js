var angular = require('angular')
  , AnimatedGif = require('Animated_GIF/src/Animated_GIF.js')

module.exports = 'gifselfies.selfie-taker'
var mod = angular.module(module.exports, [])

mod.controller('SelfieTakerCtrl', function($scope, $sce) {
  var videoElem

  $scope.webcamError = null
  $scope.webcamReady = false
  $scope.webcamConfig = {
    width: 640,
    height: 480
  }
  $scope.captures = []
  $scope.numFrames = 10
  $scope.frameDelay = 200
  $scope.playbackRate = 100

  $scope.$on('gsWebcamError', function(scope, elem, err) {
    $scope.webcamError = err.name
  })
  $scope.$on('gsWebcamReady', function(scope, elem) {
    $scope.webcamReady = true
    videoElem = elem
  })

  $scope.capture = function(numFrames, frameDelay, playbackRate) {
    var date = new Date()
    captureGif(videoElem[0], numFrames, frameDelay, playbackRate, function(image) {
      var capture = {
        image: image,
        imageUrl: URL.createObjectURL(image),
        metadata: {
          date: date,
          numFrames: numFrames,
          frameDelay: frameDelay,
          playbackRate: playbackRate
        }
      }

      $scope.captures.unshift(capture)
      if ($scope.captures.length > 20) {
        $scope.captures.length = 20
      }
      $scope.$apply()
    })
  }

  $scope.preview = function(capture) {
    $scope.previewCapture = capture
    $scope.previewActive = true
  }

  $scope.closePreview = function() {
    $scope.previewActive = false
    $scope.previewCapture = null
  }
})

function captureGif(videoElem, numFrames, frameDelay, playbackRate, cb) {
  var gifCreator = new AnimatedGif({ workerPath: 'worker.js' })
    , canvas = document.createElement('canvas')
    , context = canvas.getContext('2d')

  gifCreator.setSize(videoElem.videoWidth, videoElem.videoHeight)
  gifCreator.setDelay(frameDelay / playbackRate)
  canvas.width = videoElem.videoWidth
  canvas.height = videoElem.videoHeight

  getFrame()

  function getFrame() {
    numFrames--
    if (numFrames > 0) {
      setTimeout(getFrame, frameDelay)
    }

    context.drawImage(videoElem, 0, 0)
    gifCreator.addFrameImageData(context.getImageData(0, 0, canvas.width, canvas.height))

    if (!numFrames) {
      done()
    }
  }

  function done() {
    gifCreator.getBlobGIF(function(image) {
      gifCreator.destroy()
      cb(image)
    })
  }
}

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

    var cameraStream
    scope.$watch('config', function() {
      if (cameraStream) {
        cameraStream.stop()
        element[0].stop()
        element[0].src = null
        cameraStream = null
      }
      getCamera()
    })

    function getCamera() {
      var width = scope.config.width || 640
        , height = scope.config.height || 480
      getUserMedia({
        video: {
          mandatory: {
            minWidth: width,
            minHeight: height
          }
        }
      }, success, failure)
    }

    function success(stream) {
      var elem = element[0]
      cameraStream = stream
      if (elem.mozSrcObject) {
        elem.mozSrcObject = stream
      } else {
        elem.src = url.createObjectURL(stream)
      }

      elem.addEventListener('loadeddata', dataLoaded)
      elem.play()

      function dataLoaded() {
        elem.removeEventListener('loadeddata', dataLoaded)
        scope.$emit('gsWebcamReady', element)
        scope.$apply()
      }
    }

    function failure(err) {
      scope.$emit('gsWebcamError', element, err)
      scope.$apply()
    }
  }

  return {
    restrict: 'A',
    link: link,
    scope: {
      config: '=gsConfig'
    }
  }
})
