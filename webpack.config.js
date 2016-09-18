const webpack = require('webpack')

const globalConfig = {
  context: __dirname,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-2', 'react'],
          cacheDirectory: '.webpackcache'
        }
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json'
      },
      {
        test: /\.scss$/,
        include: /scss/,

        loaders: [
          'style',
          'css',
          'autoprefixer?browsers=last 3 versions',
          'sass?outputStyle=expanded'
         ]
      },
    ]
  }
}

const appConfig = Object.assign({}, {
  entry: './source/js/app.js',
  output: {
    path: './dist',
    filename: 'app.bundle.js',
    publicPath: '/dist/'
  },
  devtool: 'source-map',
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: 'index.html'
    }
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^en$/)
  ]
}, globalConfig)

const workerConfig = Object.assign({}, {
  entry: './source/js/worker.js',
  output: {
    path: './dist',
    filename: 'worker.bundle.js',
    publicPath: '/dist/',
    target: 'webworker'
  },
  target: 'webworker',
  devtool: 'source-map',
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: 'index.html'
    }
  }
}, globalConfig)

module.exports = [
  appConfig, workerConfig
]
