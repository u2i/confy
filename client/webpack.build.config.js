const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./webpack.default.config');

config.output = {
  filename: '[name]-bundle.js',
  path:     '../app/assets/webpack'
};

config.entry.vendor.unshift(
  'es5-shim/es5-shim',
  'es5-shim/es5-sham'
);

config.module.loaders.push(
  {
    test:    /\.jsx?$/,
    loader:  'babel-loader',
    exclude: /node_modules/
  },
  {
    test:   /\.css$/,
    loader: ExtractTextPlugin.extract(
      'style',
      'css' +
      '!postcss'
    )
  },
  {
    test:   /\.scss$/,
    loader: ExtractTextPlugin.extract(
      'style',
      'css' +
      '!postcss' +
      '!sass' +
      '!sass-resources'
    )
  },
  {
    test:   require.resolve('react'),
    loader: 'imports?shim=es5-shim/es5-shim&sham=es5-shim/es5-sham'
  },
  {
    test:   require.resolve('jquery-ujs'),
    loader: 'imports?jQuery=jquery'
  }
);

config.plugins.push(
  new ExtractTextPlugin('[name]-bundle.css', { allChunks: true }),
  new webpack.optimize.DedupePlugin()
);

console.log('Webpack production build for Rails'); // eslint-disable-line no-console

module.exports = config;
