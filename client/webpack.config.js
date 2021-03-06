const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { GenerateSW } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      // Generates webpack, injects bundle.
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'JATE',
      }),
      // CSS loader plguin
      new MiniCssExtractPlugin(),
      // Injects service worker.
      new GenerateSW({
        // Separates images from rest of service worker
        exclude: [/\.(?:png|jpg|jpeg|svg)$/],
        runtimeCaching: [{
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 50,
            },
          },
        }],
      }),
      // new InjectManifest({
      //   swSrc: './src-sw.js',
      //   swDest: 'service-worker.js',
      // }),
      // Creates manifest.json file.
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'JATE by Miguel',
        short_name: 'JATE by ME',
        description: 'Just another text editor. This time by Miguel.',
        start_url: '/',
        publicPath: '/',
        background_color: '#225ca3',
        theme_color: '#225ca3',
        crossorigin: null,
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ]
      }),
    ],

    module: {
      rules: [
        {
          // Adding babel loader to webpack
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
  };
};
