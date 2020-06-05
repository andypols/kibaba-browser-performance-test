const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const config = require('./webpack.config')

module.exports = {
  ...config,
  mode: 'production',
  watch: false,
  devtool: false,
  plugins: [...config.plugins, new BundleAnalyzerPlugin()],
}
