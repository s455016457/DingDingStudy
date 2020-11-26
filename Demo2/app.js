import SwerpApiClient from '/util/requestHelper';

App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');
    var self = this;
   
    dd.getStorage({
      key: 'ServiceHost',
      success: function(res) {
        self.ServiceHost=res.data;
        self.RefreshApiClient();
      }
    });

    dd.getStorage({
      key:'UserCookie',
      success:res=>{
        if(res.data){
          self.UserCookie=res.data.cookies;
          self.UID=res.data.identy;
        }
      }
    });

    dd.getAuthCode({
      success:function(res){
        console.log(res);
            /*{
                authCode: 'hYLK98jkf0m' //string authCode
            }*/
      },
      fail:function(err){
      }
    });
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  onHide(options){
    //当小程序从前台进入后台时触发
    this.SaveUserCookie();
  },
  ServiceHost:'',
  SwerpApiClient:undefined,
  UID:'',
  UserCookie:undefined,
  RefreshApiClient(){
    if(!this.ServiceHost){
      
        dd.alert({
          title: '温馨提示',
          content: '请设置服务主机',
          buttonText: '确定',
          success:()=>{
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

      return null;
    }

    this.SwerpApiClient = new SwerpApiClient("D981182A574D29AF3C30CF779149F2ED","1.2","8Y1PQXRY9D2QPGAWD13UPAFHONLTPRQM","X81RZASTWXL2K5FPU0TGBIW8TTADL8JS",this.ServiceHost);
  },
  SaveUserCookie(){
    console.log("SaveUserCookie");
    var self = this;
    var data = {
        identy:self.UID,
        cookies:self.UserCookie
      };
    dd.setStorage({
      key:'UserCookie',
      data:data
    });
    console.log("UserCookie",data);
    console.log("getStorageSync",dd.getStorageSync({key:'UserCookie'}));
  },
  RemoveUserCookie(){
    this.UserCookie='';
    dd.removeStorage({
      key:'UserCookie'
    })
  }
});
