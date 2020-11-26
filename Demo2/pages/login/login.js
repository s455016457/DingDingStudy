Page({
  data: {
    UID:'',
    PASSWORD:''
  },
  onLoad() {},
  bindUserId(e){
    this.setData({
      UID:e.detail.value
    });
  },
  bindPassword(e){
    this.setData({
      PASSWORD:e.detail.value
    });
  },
  onLogin(e){
    var self = this;
    console.log("Login",this.data);
    var client = getApp().SwerpApiClient;
    if(client==null) return;
    
    client.doPost("/api/Login","",this.data,function(res){
      console.log("登录成功！")
        getApp().UID=self.data.UID;
        getApp().SaveUserCookie();
        dd.redirectTo({
          url:'/pages/index/index',
          sucess:function(d){
            console.debug("页面跳转成功！",d);
          },
          fail:function(d){
            console.debug("页面跳转失败！",d);
          },
          complete:function(d){
            console.debug("页面跳转完成！",d);
          }
        });
    });
  },
  onSetting(e){
    console.log("setting");
    /**
     * url	String	是	需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用?分隔，参数键与参数值用=相连，不同参数必须用&分隔；如path?key1=value1&key2=value2
success	Function	否	调用成功的回调函数
fail	Function	否	调用失败的回调函数
complete
     */
    dd.navigateTo({
      url:'/pages/setting/setting',
      sucess:function(d){
        console.debug("页面跳转成功！",d);
      },
      fail:function(d){
        console.debug("页面跳转失败！",d);
      },
      complete:function(d){
        console.debug("页面跳转完成！",d);
      }
    });
  }
});
