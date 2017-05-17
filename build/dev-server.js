require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port // 8080
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable  // 代理接口配置


// nodeSever作用  或者  用其Router编写接口请求
var app = express()

var appData = require('../data.json');
var seller = appData.seller;  // 属性名
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router(); // 定义路由接口

apiRoutes.get('/seller',function (req, res) {  // /seller  代表路由地址
  res.json({
    errno: 0,   // 状态吗
    data: seller
  });
});

apiRoutes.get('/goods',function (req, res) {
  res.json({
    errno: 0,
    data: goods
  });
});

apiRoutes.get('/ratings',function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
});

app.use('/api', apiRoutes);  // 通过  ‘/api/goods’ 即可请求到数据

var compiler = webpack(webpackConfig) // 编译开发环境

// <script src="/app.js"></script>
// 将编译好的文件app.js放在内存中，直接通过内存访问
// 所以看不到app.js出口文件的具体位置
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath, // '/'
  quiet: true
})


var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
// 配置一个静态资源的访问路径
// 当访问的的 '/static'时，就在static文件中去找
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
