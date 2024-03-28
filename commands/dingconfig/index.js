dd.config({
  agentId: _config.agentId,
  corpId: _config.corpId,
  timeStamp: _config.timeStamp,
  nonceStr: _config.nonceStr,
  signature: _config.signature,
  jsApiList: [
    'runtime.info',
    'biz.contact.choose',
    'device.notification.confirm',
    'device.notification.alert',
    'device.notification.prompt',
    'biz.ding.post',
    'biz.util.openLink',
    'biz.navigation.setLeft',
    'biz.navigation.close',
  ],
});
//关闭
function close() {
  dd.biz.navigation.close({
    onSuccess: function (result) {},
    onFail: function (err) {},
  });
}
// 安卓
dd.ready(function() {
    document.addEventListener('backbutton', function() {
    close();
    })
});
// ios  需要加一个判断
dd.ready(function() {
    dd.biz.navigation.setLeft({
        show : true,//控制按钮显示， true 显示， false 隐藏， 默认true
        // control : true,//是否控制点击事件，true 控制，false 不控制， 默认false
        // showIcon : true,//是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
        text : '',//控制显示文本，空字符串表示显示默认文本
        onSuccess : function(result) {
            close();
        },
        onFail : function(err) {
        }
    });
});

