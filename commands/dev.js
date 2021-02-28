const path = require('path')
// const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const webpack = require('webpack')
const chalk = require('chalk')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('./webpack/webpack.config')
// const webpackConfig = require('./webpack/webpack.dev.config')
let tport =9090
let thost = '127.0.0.1'
let isFirst = true;
let proxy = false
module.exports = function () {
    const compiler = webpack(webpackConfig)
    // compiler.apply(new ProgressBarPlugin({
    //     summary: false
    // }))
    try {
        const customConfigJS = require(path.resolve(process.cwd(), './custom.config.js'))
        console.log('customConfigJS =>', customConfigJS)
        proxy = customConfigJS.proxy
        const {
            port,
            host
        } = customConfigJS.devServer || {}
        tport = port || 9090
        thost = host || '127.0.0.1'
    } catch (error) {
        console.log('error => ', error)
    }


    // 第一次编译成功时候 打开页面
    // let hasCompile = false
    // compiler.plugin('done', status => {
    //     if (!status.hasErrors() && !hasCompile) {
    //         hasCompile = true
    //     } else {
    //         console.info('========done==========')
    //     }
    // })
    const devServerOption = {
        // port: 9090,
        // contentBase: path.join(__dirname, '/dist'),
        contentBase: path.join(__dirname, './dist'),
        openPage: 'index.html',
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        open: true,
        hot: true,
        inline: true,
    }
    const server = new WebpackDevServer(compiler, devServerOption)
    server.listen(tport, thost, (error) => {
        if (error) {
            console.log(`${chalk.red('出错啦！')}`)
        } else {
            console.log(chalk.green(`server is running on:\n
            http://${thost}:${tport}`))
            /**
             * 如果有代理 则进行代理
             */
            console.log('proxy && isFirst', proxy, isFirst)
            if(proxy && isFirst) {
                require('./anyproxy/server')
            }
            isFirst = false
        }

    })
}