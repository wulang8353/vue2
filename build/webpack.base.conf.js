var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {   // 找不到模块引入，就从指定文件名处找，再或者去nodemodules中
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    // 启动webpack-dev-server后，你在目标文件夹中是看不到编译后的文件的
    path: config.build.assetsRoot,
    filename: '[name].js', // 对应的是entry的属性-app
    publicPath: process.env.NODE_ENV === 'production'
      // 请求的静态资源绝对路径 assetsPublicPath: '/'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {                              // 通过require引入的模块
    extensions: ['.js', '.vue', '.json'], // 可以在require引入的模块路径中补全文件后缀
    alias: {                              // 通过别名去缩短模块路径整个字符串长度
      'src': path.resolve(__dirname, '../src'),
      'common': path.resolve(__dirname, '../src/common'),
      'components': path.resolve(__dirname, '../src/components'),
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,   // 两者both
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // include 只对下面的文件进行处理
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          // assetsSubDirectory ->config.dev.assetsSubDirectory = static
          // 表达式：'static/img/[name].hash值.[类型]'
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
