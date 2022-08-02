import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import { spawn } from 'child_process';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import 'webpack-dev-server';
import baseConfig from './webpack.config.base';

export default merge(baseConfig, {
  devtool: 'inline-source-map',

  mode: 'development',

  target: ['web', 'electron-renderer'],

  entry: [path.join(__dirname, '../src/renderer/index.tsx')],

  output: {
    path: path.join(__dirname, '../dist/renderer'),
    filename: 'index.js',
    publicPath: '/',
    library: {
      type: 'umd',
    },
  },

  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: true,
          },
        },
      },
      {
        test: /\.(png|ico|ttf|woff2?|eot|otf|svg)$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/renderer/index.html'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: false,
    }),
    new ReactRefreshWebpackPlugin(),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },

  devServer: {
    port: 8080,
    compress: true,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    static: {
      publicPath: '/',
    },
    historyApiFallback: {
      verbose: true,
    },
    setupMiddlewares(middlewares) {
      console.log('Starting preload.js builder...');
      const preloadProcess = spawn('yarn', ['start:preload'], {
        shell: true,
        stdio: 'inherit',
      })
        .on('close', (code: number) => process.exit(code))
        .on('error', spawnError => console.error(spawnError));

      console.log('Starting Main Process...');
      spawn('yarn', ['start:main'], {
        shell: true,
        stdio: 'inherit',
      })
        .on('close', (code: number) => {
          preloadProcess.kill();
          process.exit(code);
        })
        .on('error', spawnError => console.error(spawnError));
      return middlewares;
    },
  },
});
