var path = require("path");
module.exports = {
  entry: './components/app.jsx',
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.css$/,
        loaders: ["style", "css"]
      },
      { test: /\.eot|\.woff2|\.woff|\.ttf|\.svg/, loader: "file-loader" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}