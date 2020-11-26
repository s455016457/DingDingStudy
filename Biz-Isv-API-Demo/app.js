App({
  onLaunch(options) {
    console.log('App Launch App 启动时触发', options,"冷启动时触发，第一次启动小程序或小程序被销毁后再次打开时触发");
    console.log('异步获取系统信息 getSystemInfoSync', dd.getSystemInfoSync());
    console.log('获取Sdk版本 SDKVersion', dd.SDKVersion);
  },
  onShow() {
    console.log('App Show  App显示时触发，热启动');
  },
  onHide() {
    console.log('App Hide  App隐藏时触发');
  },
  globalData: {
    hasLogin: false,
  },
});
