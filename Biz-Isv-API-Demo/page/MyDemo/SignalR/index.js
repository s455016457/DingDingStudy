
// 获取应用实例
const app = getApp();

Page({
  data: {
    appid: 'aaaaaaaa',
    websocketServer: '开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名',
    sendMessageAbility: false,
    toSendMessage: 'test',
    closeLinkAbility: false,
    log: '',
  },

  onLoad() {
// console.log("sdfwefww");
// console.log(jQuery);
// console.log(window);
// // 引入SignalR包

  },

  onServerAddressComplete(e) {
    this.setData({
      websocketServer:e.detail.value,
    });
  },

  onSendMessageReady(e) {
    this.setData({
      toSendMessage:e.detail.value,
    });
  },

  connect_start() {
    debugger;
    console.log(webSocket);
    var webSocket  = WebSocket.new(this.data.websocketServer,"chat");
    webSocket.send("hello");

    // dd.connectSocket({
    //   url: this.data.websocketServer, // 开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名
    //   success: (res) => {
    //   console.log('webSocket.js','WebSocket 建立连接成功！' , res);
    //     dd.showToast({
    //       content: 'success', // 文字内容
    //     });
    //   },
    //   fail:()=>{
    //     dd.showToast({
    //       content: 'fail', // 文字内容
    //     });
    //   }
    // });
  },

  send_start() {
    dd.sendSocketMessage({
      data: this.data.toSendMessage, // 需要发送的内容
      success: (res) => {
        dd.alert({content: '数据发送！' + this.data.toSendMessage});
      },
    });
  },

  close_start() {
    dd.closeSocket();
  },
});
