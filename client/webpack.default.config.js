const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  context: __dirname,
  entry:   {
    vendor: [
      'babel-polyfill',
      'es5-shim/es5-shim',
      'es5-shim/es5-sham',
      'jquery',
      'jquery-ujs',
      'turbolinks',
      'bootstrap-loader'
    ],
    app: [
      './app/Register.jsx'
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    })
  ],
  module: {
    loaders: [
      { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
      { test: /\.(ttf|eot)$/, loader: 'file' },
      { test: /\.(jpe?g|png|gif|svg|ico)$/, loader: 'url?limit=10000' },
      { test: require.resolve('jquery'), loader: 'expose?jQuery' },
      { test: require.resolve('jquery'), loader: 'expose?$' },
      { test: require.resolve('turbolinks'), loader: 'imports?this=>window' }
    ]
  },
  postcss:       [autoprefixer],
  sassResources: ['./app/assets/stylesheets/sass_resources.scss']
};
