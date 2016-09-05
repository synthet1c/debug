const webpack = require('webpack')

module.exports = {
  context: __dirname,
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
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^en$/)
  ]
};
