// const pkg = require('./package.json');

const webpack = require('webpack');
const Path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin')
// const env = process.env.NODE_ENV
const cwd = process.cwd()
const resolve = (dir) => Path.resolve(cwd, dir)
module.exports = {
  mode: 'production',
  devtool: false,
  entry: Path.resolve(__dirname, '../doc/index.js'),
  output: {
    path: resolve('dist'),
    filename: 'cust.min.js',
    library: 'cust',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [ // 直接使用loader引用指针有问题 todos 需要重新定向
      {
        test: /\.html$/, loader: Path.resolve(__dirname, '../../node_modules/html-loader')
      },
      { 
        test: /\.js$/, loader: Path.resolve(__dirname, '../../node_modules/babel-loader')
      },
      // {
      //   test: /\.(less|css)$/,
      //   loader: ['style-loader','css-loader','less-loader']
      // },
      // {
      //   test: /\.(png|jpe?g|gif)$/i,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //     },
      //   ],
      // },
    ]
  },
  // stats: {
  //   colors: true,
  // },
  plugins: [
    // new Webpack.BannerPlugin([
    //     'vConsole v' + pkg.version + ' (' + pkg.homepage + ')',
    //     '',
    //     'Tencent is pleased to support the open source community by making vConsole available.',
    //     'Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.',
    //     'Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at',
    //     'http://opensource.org/licenses/MIT',
    //     'Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.'
    // ].join('\n')),
    // new CopyWebpackPlugin([
    //   {
    //     from: Path.resolve(__dirname, './src/vconsole.d.ts'),
    //     to: Path.resolve(__dirname, './dist/vconsole.min.d.ts')
    //   },
    //   {
    //     from: Path.resolve(__dirname, './src/vconsole.d.ts'),
    //     to: Path.resolve(__dirname, './dist/firefly.min.d.ts')
    //   }
    // ])
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      template: Path.join(__dirname, '../doc/index.html'),
      filename: 'index.html'
    })
  ]
};