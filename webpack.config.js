const path = require('path');
const webpack = require('webpack');
const typescript = require('typescript');
const { AotPlugin } = require('@ngtools/webpack');
const jsonServer = require('json-server');

const rules = [
  { test: /\.html$/, use: 'html-loader' },
  { test: /\.s[ac]ss$/i, type: 'asset/source' },
  // {
  //       test: /\.s[ac]ss$/i,
  //       use: [
  //         // Creates `style` nodes from JS strings
  //         "style-loader",
  //         // Translates CSS into CommonJS
  //         "css-loader",
  //         // Compiles Sass to CSS
  //         "sass-loader",
  //       ],
  //     },
  { test: /\.(jpe?g|png|gif|svg)$/i, type: 'asset/resource' },
];

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  })
];

if (process.env.NODE_ENV === 'production') {
  rules.push({
    test: /\.ts$/,
    use: ['@ngtools/webpack']
  });
  plugins.push(
    new AotPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: 'src/app/app.module#AppModule',
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
      },
      compress: {
        unused: true,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        drop_console: true,
        sequences: true,
        booleans: true,
        screw_ie8: true,
        warnings: false,
      },
      comments: false,
    })
  );
} else {
  rules.push({
    test: /\.ts$/,
    use: [
      'awesome-typescript-loader',
      'angular-router-loader',
      'angular2-template-loader'
    ]
  });
  plugins.push(
    // new webpack.NamedModulesPlugin(),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, './notfound')
    )
  );
}

module.exports = {
  cache: true,
  context: __dirname,
  devServer: {
    contentBase: __dirname,
    historyApiFallback: true,
    stats: {
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      errors: true,
      errorDetails: false,
      hash: false,
      timings: false,
      modules: false,
      warnings: false,
    },
    publicPath: '/build/',
    port: 3000,
    before: function(app) {
      app.use('/api', jsonServer.router('db.json'));
    },
  },
  devtool: 'eval-source-map',
  entry: {
    app: ['zone.js/dist/zone', './src/main.ts'],
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name]-chunk.js',
    publicPath: '/build/',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    splitChunks: {name: 'vendor', chunks: 'all'}
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['src', 'node_modules'],
  },
  plugins,
};
