const path = require('path');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css/,
        loaders: ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, '../'),
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              // SVG imports need to be tweaked to work in storybook properly
              // (copied from our `config/webpack.config.js`)
              require.resolve('babel-plugin-named-asset-import'),
              {
                loaderMap: {
                  svg: {
                    ReactComponent: '@svgr/webpack?-svgo,+ref![path]',
                  },
                },
              },
            ],
          ],
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|png)$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json')
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      $COMMIT_HASH: JSON.stringify(new GitRevisionPlugin().commithash()),
    }),
  ],
};
