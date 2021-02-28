const systemProxy = require('./systemProxyMgr')
const AnyProxy = require('anyproxy');
const chalk = require('chalk');
/**
 * 代理服务器端口8100
 * 
 */
const options = {
  port: 8100,
  // 通过外部的rule来引入
  rule: require('./myRuleModule'),
  webInterface: {
    enable: true,
    webPort: 8002
  },
  throttle: 10000,
  forceProxyHttps: false,
  wsIntercept: false, // 不开启websocket代理
  silent: false
};
const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on('ready', () => {
    systemProxy.enableGlobalProxy('127.0.0.1', 8100)
    systemProxy.enableGlobalProxy('127.0.0.1', 8100, 'https')
    console.log(chalk.green(' anyporxy ready'))
 });
proxyServer.on('error', (e) => { 
    console.log(' anyproxy error', e)
 });
proxyServer.start();

/**
 * 删除信号
 */
process.on('SIGINT', function() {
    console.log(chalk.red('SIGINT信号'))
    proxyServer && proxyServer.close()
    // 默认为http
    systemProxy.disableGlobalProxy()
    systemProxy.disableGlobalProxy('https')
    process.exit()
})

process.on('SIGHUP', function() {
    console.log(chalk.red('SIGHUP信号'))
    proxyServer && proxyServer.close()
    systemProxy.disableGlobalProxy()
    systemProxy.disableGlobalProxy('https')
    process.exit()
})

//when finished
// proxyServer.close();