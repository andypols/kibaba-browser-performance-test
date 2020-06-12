const path = require('path')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  watch: true,
  devtool: 'cheap-source-map',
  entry: {
    background: './src/background',
    options: './src/options',
    monitor: './src/monitor',
  },
  output: {
    path: path.resolve('extension/dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'System Monitor',
      filename: 'monitor.html',
      chunks: ['monitor'],
    }),
    new HtmlWebpackPlugin({
      title: 'System Monitor',
      filename: 'options.html',
      chunks: ['options'],
    }),
  ],
}
