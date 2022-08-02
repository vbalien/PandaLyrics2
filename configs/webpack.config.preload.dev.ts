import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.config.base';

export default merge(baseConfig, {
  devtool: 'inline-source-map',

  mode: 'development',

  target: ['electron-preload'],

  entry: [path.join(__dirname, '../src/main/preload.ts')],

  output: {
    path: path.join(__dirname, '../dist/'),
    filename: 'preload.js',
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },

  watch: true,
});
