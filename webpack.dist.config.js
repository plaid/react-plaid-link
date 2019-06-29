const webpack = require('webpack');
const path = require('path');


const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

const reactDOMExternal = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom',
};

module.exports = {

  entry: {
    'react-plaid-link': './src/PlaidLink.js',
    'react-plaid-link.min': './src/PlaidLink.js',
  },

  externals: {
    'react': reactExternal,
    'react-dom': reactDOMExternal,
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    libraryTarget: 'umd',
    library: 'ReactPlaidLink',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      compress: {
        warnings: false,
      },
    }),
  ],

  module: {
    rules: [
      { test: /\.js?$/, exclude: /node_modules/, use: { loader: 'babel-loader' }},
    ],
  },

};
