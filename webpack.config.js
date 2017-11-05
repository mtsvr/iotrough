var webpack = require('webpack');

var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin')
var WriteFilePlugin = require('write-file-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);

module.exports = {
  entry: [
    'react-hot-loader/patch',
    path.resolve(ROOT_PATH, 'app/src/index'),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
      	presets:['es2015', 'react', 'stage-1'],
        plugins: ['react-hot-loader/babel',
        "transform-decorators-legacy"]
      },
      include: path.resolve(ROOT_PATH, 'app/src'),
    },
    {
      test: /\.scss$/,
      loaders: ['style-loader','css-loader','sass-loader']
    },
    {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader']
    },
    {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000'
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(ROOT_PATH, 'app/build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(ROOT_PATH, 'app/build'),
    outputPath: path.join(ROOT_PATH, 'app/build'),
    historyApiFallback: true,
    inline: true,
    progress: true,
    host: '0.0.0.0',
    disableHostCheck: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlwebpackPlugin({
      title: 'IoTrough'
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: process.env.NODE_ENV === 'production',
      compress: process.env.NODE_ENV === 'production'?{
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      }:false,
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi] // skip pre-minified libs
    }),
    
  ]
};
