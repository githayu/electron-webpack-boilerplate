const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshTypeScript = require('react-refresh-typescript')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV !== 'production'

/** @type {import('webpack').Configuration} */
module.exports = {
  name: 'renderer',
  entry: {
    index: './src/renderer/index.tsx',
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'inline-source-map' : false,
  target: 'electron-renderer',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'out/renderer'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: isDev ? [ReactRefreshTypeScript()] : [],
              }),
              compilerOptions: {
                jsx: isDev ? 'react-jsxdev' : 'react-jsx',
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Electron Webpack Boilerplate',
      template: 'src/renderer/index.html',
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(isDev ? 'development' : 'production'),
    }),
    isDev && new webpack.HotModuleReplacementPlugin(),
    isDev && new ReactRefreshWebpackPlugin(),
    // new require('webpack-bundle-analyzer').BundleAnalyzerPlugin(),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    writeToDisk: true,
    contentBase: 'out/renderer',
  },
}
