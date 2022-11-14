import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import baseConfig from './webpack.config.base';

export default merge(baseConfig, {
  mode: 'production',

  target: 'electron-main',

  externals: [nodeExternals()],

  entry: {
    main: path.join(__dirname, '../src/main/main.ts'),
    preload: path.join(__dirname, '../src/main/preload.ts'),
  },

  output: {
    path: path.join(__dirname, '../dist/main'),
    filename: '[name].js',
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: [
              'babel-plugin-transform-typescript-metadata',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
            presets: ['@babel/preset-typescript'],
          },
        },
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },
});
