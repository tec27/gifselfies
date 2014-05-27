var angular = require('angular')

var app = angular.module('gifselfies', [
  require('./selfie-taker')
])

app.config(function($compileProvider) {
  // TODO(tec27): When angular 1.3.0+ is available on NPM, this can be removed
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//)
});


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
