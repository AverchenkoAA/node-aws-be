const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = (async () => {
  return {
    context: __dirname,
    entry: slsw.lib.entries,

    target: 'node',
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',

    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'dist/const/*.js' },
                { from: 'dist/service/*.js' },
                { from: 'dist/mainHandler/*.js' },
            ]
        })
    ],

    resolve: {
      extensions: ['.js', '.json', '.ts'],
      symlinks: false,
      cacheWithContext: false,
    },

    output: {
      libraryTarget: 'commonjs',
      path: path.join(__dirname, '.webpack'),
      filename: '[name].js',
    },

    externals: [nodeExternals()],

    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        {
          test: /\.(tsx?)$/,
          loader: 'ts-loader',
          include: [path.resolve(__dirname, './')],
          exclude: [
            [
              path.resolve(__dirname, 'node_modules'),
              path.resolve(__dirname, '.serverless'),
              path.resolve(__dirname, '.webpack'),
            ],
          ],
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
          },
        },
      ],
    },
  };
})();
