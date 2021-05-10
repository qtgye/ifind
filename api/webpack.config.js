const path = require('path');
const nodeExternals = require('webpack-node-externals');

const appRoot = process.cwd();
const resolveApp = (relativePath = '') => path.resolve(appRoot, relativePath);

module.exports = {
  // mode: 'development',
  entry: {
    server: resolveApp('server.js'),
  },
  target: 'node',
  module: {
    rules: [
      {
        // Transpiles ES6-8 into ES5
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins 
        test: /\.html$/,
        use: [{loader: "html-loader"}]
      }
    ]
  },
  externals: [nodeExternals()],
  stats: {
    errorDetails: true
  }
};