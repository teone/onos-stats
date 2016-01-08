var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: [
    './components/app.jsx'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [node_modules_dir],
        loaders: ['babel?presets[]=react,presets[]=es2015']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      { test: /\.eot|\.woff2|\.woff|\.ttf|\.svg/, loader: 'file-loader' }
    ]
  }
}