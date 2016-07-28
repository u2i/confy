const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const devBuild = process.env.NODE_ENV !== 'production';
const nodeEnv = devBuild ? 'development' : 'production';

module.exports = {
  context: __dirname,
  entry:   {
    vendor: [
      'babel-polyfill',
      'es5-shim/es5-shim',
      'es5-shim/es5-sham',
      'jquery',
      'turbolinks'
    ],
    app: [
      './app/App.jsx'
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    alias:      {
      helpers: path.join(__dirname, 'app', 'helpers'),
      schemas: path.join(__dirname, 'app', 'schemas')
    }
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
  sassResources: ['./app/assets/stylesheets/_variables.scss']
};
