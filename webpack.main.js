const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV !== 'production'

/** @type {import('webpack').Configuration} */
module.exports = {
  name: 'main',
  entry: {
    index: './src/main/index.ts',
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'inline-source-map' : false,
  target: 'electron-main',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'out/main'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(isDev ? 'development' : 'production'),
    }),
    new NodemonPlugin(),
    // new require('webpack-bundle-analyzer').BundleAnalyzerPlugin(),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}
