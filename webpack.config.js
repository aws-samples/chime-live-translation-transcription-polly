var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['regenerator-runtime/runtime.js', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index_bundle.js',
  },
  performance: {
    hints: false,
    maxEntrypointSize: 5120000,
    maxAssetSize: 5120000,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,

        type: 'asset/resource',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
      },
    ],
  },
  mode: 'development',
  experiments: {
    topLevelAwait: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
  ],
};
