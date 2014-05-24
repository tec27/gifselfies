var angular = require('angular')

var app = angular.module('gifselfies', [
  require('./selfie-taker')
])

app.run(function($rootScope, $timeout) {
  $timeout(function() {
    var getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia

    $rootScope.appInitialized = true
    $rootScope.appIncompatible = !getUserMedia
  }, 0)
})
