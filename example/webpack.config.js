const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
// Replace `../ipfs-webpack-plugin` with `ipfs-webpack-plugin` in your application
const IPFSWebpackPlugin = require('../ipfs-webpack-plugin')

module.exports = {
  entry: {
    app: './index.js',
    vendors: './extend.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js?v=[hash:12]'
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new IPFSWebpackPlugin()]
}