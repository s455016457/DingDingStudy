
Page({
  data: {
    ServiceHost:''
  },
  onLoad() {
    this.setData({
      ServiceHost:getApp().ServiceHost
    });
  },
  bindServiceHost(e){
    this.setData({ServiceHost:e.detail.value});
  },
  onSave(e){
    /**
     * key	String	是	缓存数据的key
data	Object/String	是	要缓存的数据
success	Function	否	调用成功的回调函数
fail	Function	否	调用失败的回调函数
complete	Function	否	调用结束的回调函数（调用成功、失败都会执行）
     */
    dd.setStorage({
      key:'ServiceHost',
      data:this.data.ServiceHost,
      success:function(d){
        dd.showToast({
          content:'保存成功！',
          type:'success'
        });
        console.debug("设置缓存成功！",d);
      },
      fail:function(d){
        console.debug("设置缓存失败！",d);
      },
      complete:function(d){
        console.debug("设置缓存完成！",d);
      }
    });
    getApp().ServiceHost=this.data.ServiceHost;
    getApp().RefreshApiClient();
  },
  onTest(e){
    var client = getApp().SwerpApiClient;
    if(client==null) return;

    client.doPost("/api/Test/Test","","",function(res){
      console.log("ssssffff",res);
      if(res.data.data){
        dd.alert({
          title: '温馨提示',
          content: '服务主机设置正确',
          buttonText: '确定'
        });
      }else{
      dd.alert({
        title:'服务主机设置错误',
        content:res.Message,
          buttonText: '确定'
      });
      }
    },function(res){
      dd.alert({
        title:'服务主机设置错误',
        content:res.errorMessage,
          buttonText: '确定'
      });
    },function(){

    });
  },
  onChangeAccount(e){
    getApp().RemoveUserCookie();
    dd.reLaunch({
      url:'/pages/login/login'
    });
  }
});
