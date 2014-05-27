var express = require('express')
  , app = express()

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.disable('x-powered-by')

app.use(require('serve-static')(__dirname + '/static'))

var env = process.env.NODE_ENV || 'development'
if (env == 'development') {
  app.use(require('errorhandler')())
}

app.get('/', function(req, res) {
  res.render('index')
})

var browserify = require('browserify-middleware')
browserify.settings({ transform: [ 'browserify-ngmin' ] })
app.get('/client.js', browserify(require.resolve('./client/index.js')))
app.get('/worker.js', function(req, res) {
  res.sendfile(require.resolve('Animated_GIF/dist/Animated_GIF.worker.min.js'))
})

var port = process.env.PORT || 3333
app.listen(port)
console.log('listening on port ' + port)
