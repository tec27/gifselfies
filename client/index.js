var angular = require('angular')

var app = angular.module('gifselfies', [ ])

app.run(function($rootScope, $timeout) {
  $timeout(function() {
    $rootScope.appInitialized = true
    $rootScope.apply()
  }, 0)
})
