const webpack = require('webpack')
const chalk = require('chalk')
const webpackConfig = require('./webpack/webpack.config')

module.exports = function () {
    webpack(webpackConfig, function(err, stats) {
        if(err) {
            console.log(chalk.red(err.toString()))
            return
        }
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }))
        
    })
}