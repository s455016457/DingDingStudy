if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


      if( navigator.userAgent && (navigator.userAgent.indexOf('LyraVM') > 0 || navigator.userAgent.indexOf('AlipayIDE') > 0) ) {
        var AFAppX = self.AFAppX.getAppContext ? self.AFAppX.getAppContext().AFAppX : self.AFAppX;
      } else {
        importScripts('https://appx/af-appx.worker.min.js');
        var AFAppX = self.AFAppX;
      }
      self.getCurrentPages = AFAppX.getCurrentPages;
      self.getApp = AFAppX.getApp;
      self.Page = AFAppX.Page;
      self.App = AFAppX.App;
      self.my = AFAppX.bridge || AFAppX.abridge;
      self.abridge = self.my;
      self.Component = AFAppX.WorkerComponent || function(){};
      self.$global = AFAppX.$global;
      self.requirePlugin = AFAppX.requirePlugin;
    

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../pages/CustomComponent/SearchBox/SearchBox?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/CustomComponent/ApproveBox/ApprovePanel?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/index/index?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/login/login?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/chengfabiao/chengfabiao?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/setting/setting?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/MyApprove/MyApprove?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/ApproveUser/ApproveUser?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/CustomComponent/CustomComponent?hash=2846191e80d5d0134049fca0bca8a13570d63f6d');
require('../../pages/CustomComponent/ApproveBox/ApproveHistoryPanel?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/UploadFile/UploadFile?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}