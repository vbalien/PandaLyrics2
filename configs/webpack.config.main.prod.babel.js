import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.config.base';

export default merge(baseConfig, {
  mode: 'production',

  target: 'electron-main',

  entry: path.join(__dirname, '../src/main/index.ts'),

  output: {
    path: path.join(__dirname, '../dist/main'),
    filename: 'index.js',
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
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
