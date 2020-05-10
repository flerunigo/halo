const webpack = require("webpack")
const path = require("path")

let config = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "./bundle.js"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
    }
  }
  
  module.exports = config
