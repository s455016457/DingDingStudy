// import CryptoJS  from '/node_modules/crypto-js';
import dateExtend from '/util/dateExtend';
import AESCrypto from '/util/AESCrypto';
import HmacSha1Sign from '/util/HmacSha';

export default function SwerpApiClient(iv,api_version,app_Key,app_secret,serverHost){

  var CryptoJS = require("crypto-js");

  var self=this;

  self.iv=iv;
  self.apiVersion=api_version;
  self.appKey=app_Key;
  self.appSecret=app_secret;
  self.serverHost=serverHost;
  
  self.encryptor = function (body) {
    console.log("开始执行加密,api版本：" + this.apiVersion);

    switch (this.apiVersion) {
      case "1.2":
        return encryptor1_2.call(self,body);
      case "0.0":
      default:
        return body;
    }
  };

  self.decryptor = function (body) {
    console.log("开始执行解密,api版本：" + this.apiVersion);

    switch (this.apiVersion) {
      case "1.2":
        return decryptor1_2.call(self,body);
      case "0.0":
      default:
        return body;
    }
  };
  
  self.signRequest = function (uriPath,body,requestDataStamp,httpMethod) {
    console.log("开始签名,api版本：" + this.apiVersion);

    switch (this.apiVersion) {
      case "1.2":
        return signRequest1_2.call(self,uriPath,body,requestDataStamp,httpMethod);
      case "0.0":
        return signRequest0_0.call(self,uriPath,body,requestDataStamp,httpMethod);
      default:
        break;
    }
  };

  self.verificationSign = function (body) {
    console.log("开始验证签名");
    console.log("开始验证签名,api版本：" + this.apiVersion);

    switch (this.apiVersion) {
      case "1.2":
        return verificationSign1_2.call(self,body);
      case "0.0":
      default:
        return body;
    }
  };

  self.doPost=function(api,queryString,bodyData,success,fail,complete){
    doHttpRequest("POST",api,queryString,bodyData,success,fail,complete);
  };

  self.doGet=function(api,queryString,bodyData,success,fail,complete){
    doHttpRequest("GET",api,queryString,bodyData,success,fail,complete);
  };
  
  self.doUploadFile=function(api,queryString,bodyData,file,success,fail,complete){
    var header = {
      // "Content-Type": "application/json",
      // "Accept-Language":["zh","zh-CN; q=0.9","en; q=0.8"],
      "app_key":self.appKey,
      "api_version": self.apiVersion,
      "Cookie":getApp().UserCookie,
      "timestamp":new Date().format("yyyy-MM-ddTHH:mm:sszzz")
    };
    console.log("请求头：",header);

    var url = BuildUriPath('http://'+self.serverHost+api,queryString);
    console.log("请求地址：",url);
    
    var strBodyData="";
    if(bodyData){
      strBodyData = JSON.stringify(bodyData);
      strBodyData = self.encryptor(strBodyData);
    }
    /**
        对请求签名
    **/
    // 取消此处注释，解决钉钉在http请求时在url参数后添加&符号，导致服务端验证签名失败问题
    if(queryString)
      header.sign = self.signRequest(url+'&',strBodyData,header.timestamp,"POST");
    else
      header.sign = self.signRequest(url,strBodyData,header.timestamp,"POST");

    dd.showLoading({
      content: '上传中...',
    });

    dd.uploadFile({
      url:url,
      header:header,
      formData:{FormData:strBodyData},
      fileType:file.fileType,
      fileName:file.fileName,
      filePath:file.filePath,
      success:res=>{
        httpSuccess(res,fail);
        if(success&& typeof(success)==="function"){
          success(res);
        }
        dd.showToast({
          content:'文件上传成功！',
          type:'success'
        });
      },
      fail:res=>{
        httpFail(res);
        var errorMsg="";
        switch(res.error){
          case 11:
            errorMsg="文件不存在";
            break;
          case 12:
            errorMsg="上传文件失败";
            break;
          case 13:
            errorMsg="没有文件权限";
            break;
          case 4:
            errorMsg="无权跨域调用";
            break;
        }

        if(errorMsg)
        {          
          dd.alert({
            title:'温馨提示',
            content:errorMsg,
            buttonText: '确定'
          });
          return;
        }

        if(fail&& typeof(fail)==="function"){
          fail(res);
        }
      },
      complete:res=>{
        console.debug("complete",res);
        if(complete&& typeof(complete)==="function"){
          complete(res);
        }
        dd.hideLoading();
      }
    });
  }

  function doHttpRequest(requestMethod,api,queryString,bodyData,success,fail,complete){
    var header = {
        "Content-Type": "application/json",
        "Accept-Language":["zh","zh-CN; q=0.9","en; q=0.8"],
        "app_key":self.appKey,
        "api_version": self.apiVersion,
        "Cookie":getApp().UserCookie
      };
    header.timestamp=new Date().format("yyyy-MM-ddTHH:mm:sszzz");

    console.log("请求头",header)
    
    var url = BuildUriPath('http://'+self.serverHost+api,queryString);
    console.log(requestMethod,url);

    requestMethod = requestMethod.toUpperCase();
    var strBodyData="";
    switch(requestMethod){
      case "GET":
        strBodyData="";
        break;
      case "POST":
      case "DELETE":
      case "UPDATE":
        if(bodyData){
          strBodyData=JSON.stringify(bodyData);
          strBodyData = self.encryptor(strBodyData);
        }
        break;
      default:
        throw "未知的请求方法:"+requestMethod;
    }
    /**
        对请求签名
    **/
    // 取消此处注释，解决钉钉在http请求时在url参数后添加&符号，导致服务端验证签名失败问题
    if(queryString)
      header.sign = self.signRequest(url+'&',strBodyData,header.timestamp,"POST");
    else
      header.sign = self.signRequest(url,strBodyData,header.timestamp,"POST");

    dd.showLoading({
      content: '加载中...',
    });

    dd.httpRequest({
      headers: header,
      url: url,
      method: requestMethod,
      // 需要手动调用JSON.stringify将数据进行序列化
      data: strBodyData,
      dataType: 'json',
      success: function(res) {
        httpSuccess(res,fail);
        if(success&& typeof(success)==="function"){
          success(res);
        }
      },
      fail: function(res) {
        httpFail(res);
        if(fail&& typeof(fail)==="function"){
          fail(res);
        }
      },
      complete: function(res) {
        console.debug("complete",res);
        if(complete&& typeof(complete)==="function"){
          complete(res);
        }
        dd.hideLoading();
      }
    });
  }


  function httpSuccess(res,fail){
    getApp().UserCookie = getCookie(res.header);
    console.log("获取到的新cookie：", res.header,getApp().UserCookie);
    console.debug("success",res);
    try{
      res.data = self.verificationSign(res.data);
      self.decryptor(res.data);
    }catch(e){
      dd.showToast({
        content:e,
        type:'exception'
      });
    }
      
    if(res.data&&res.data.data&&typeof(res.data.data)==="string"){
      res.data.data = JSON.parse(res.data.data);

      if(res.data.data.MSG){
        switch(res.data.data.CODE){
          case "not_log_in":
          case "not_get_user_cookie":
          case "user_cookie_expired":
            dd.alert({
              title:'用户登录失败',
              content:res.data.data.MSG,
              buttonText: '确定',
              success:()=>{
                dd.reLaunch({
                  url:'/pages/login/login',
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
            return;
        }
        dd.alert({
          title:'温馨提示',
          content:res.data.data.MSG,
          buttonText: '确定'
        });
        if(fail&& typeof(fail)==="function"){
          fail(res);
        }
        return;
      }
    }
  }

  function httpFail(res){
    console.debug("fail",res);
    if(!res.data) return;
    try{
      res.data = self.verificationSign(res.data);
      self.decryptor(res.data);
    }catch(e){}
        
    if(res.data&&res.data.data&&typeof(res.data.data)==="string"){
      try{
        res.data.data = JSON.parse(res.data.data);
      }catch(e){}

      if(res.data.data.MSG){
        switch(res.data.data.CODE){
          case "not_log_in":
          case "not_get_user_cookie":
          case "user_cookie_expired":
            dd.alert({
              title:'用户登录失败',
              content:res.data.data.MSG,
              buttonText: '确定',
              success:()=>{
                dd.reLaunch({
                  url:'/pages/login/login',
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
            return;
          default:
            dd.alert({
              title:'错误',
              content:res.data.data.MSG,
              buttonText: '确定'
            });
        }
      }
    }else{
      dd.alert({
        title:'错误',
        content:res.data,
        buttonText: '确定'
      });
    }
  }

  function getCookie(header){
    if(!header) return undefined;
    var cookie = header["set-cookie"]||header["Set-Cookie"];

    if(header.length){
      for(let i = 0;i<header.length;i++){
        var element=header[i];
        
        if(element["set-cookie"]){
          cookie = element["set-cookie"];
          break;
        }
        if(element["Set-Cookie"]){
          cookie = element["Set-Cookie"];
          break;
        }
      }
    }

    if(typeof(cookie)==="string"){
      cookie = [cookie];
    }

    return cookie;
  }
  
  function encryptor1_2(body) {
      var aes = new AESCrypto(self.appSecret, self.iv);
      if (!body) return;
      console.log("明文为：" + body);
      body = body || "";
      if (typeof (body) === "object")
        body = JSON.stringify(body);
      if (body === "{}")
        body = "";
      var mw = aes.encryptor(CryptoJS.enc.Utf8.parse(body || ""));
      var encry = mw.toString(CryptoJS.enc.Base64);
      console.log("密文为：" + encry);
      return encry;
  }

  function decryptor1_2(body) {
    var aes = new AESCrypto(self.appSecret, self.iv);
    body = body || "";
    console.log("获取到响应数据：");
    console.log(body);
    
    var mw = aes.decryptor(CryptoJS.enc.Base64.parse(body.data || ""));
    var decry = mw.toString(CryptoJS.enc.Utf8);
    console.log("明文为：" + decry);
    body.data = decry;
    return body;
  }

  function signRequest1_2(uriPath,body,requestDataStamp,httpMethod) {
    var shasign = new HmacSha1Sign(CryptoJS.enc.Utf8.parse(this.appSecret));
    body = body || "";
    var urlQuery = getQueryString(uriPath);
    var bodyParam = body || "";

    switch (httpMethod) {
      case 'GET':
      case 'DELETE':
        bodyParam = "";
        break;
    }

    var param = urlQuery + bodyParam;
    // G6TL12YIL1VX6A1UM526JM15YJB1W26B
    // api_version1.2
    // app_key904EG960DV56ISV5FI0K51X960UW5ZJT
    // param_jsontOVSWVr0fskMSzFyeocbClEf8qvHOwHVtOhwTdp9zj7vgt9p5F2L30QBUgTHfaNX
    // timestamp2018 - 07 - 10T17: 24:22 + 08:00

    var signStr = this.appSecret
      + "api_version" + this.apiVersion
      + "app_key" + this.appKey
      + (param.length > 0 ? "param_json" + param : "")
      + "timestamp" + requestDataStamp;
    console.log("待签名字符串：" + signStr);
    var sign = shasign.sign(CryptoJS.enc.Utf8.parse(signStr));
    sign = GetSign(sign).toString(CryptoJS.enc.Base64);
    console.log("签名为：" + sign);
    return sign;
  }

  function signRequest0_0(uriPath,body,requestDataStamp,httpMethod) {
    var urlQuery = getQueryString(uriPath);
    urlQuery = urlQuery || "";
    var bodyParam = body || "";
    switch (httpMethod) {
      case 'GET':
      case 'DELETE':
        bodyParam = "";
        break;
    }
    var param = urlQuery + bodyParam;
    // G6TL12YIL1VX6A1UM526JM15YJB1W26B
    // api_version0.0
    // app_key904EG960DV56ISV5FI0K51X960UW5ZJT
    // param_jsontOVSWVr0fskMSzFyeocbClEf8qvHOwHVtOhwTdp9zj7vgt9p5F2L30QBUgTHfaNX
    // timestamp2018 - 07 - 10T17: 24:22 + 08:00
    // G6TL12YIL1VX6A1UM526JM15YJB1W26B
      
    var signStr = self.appSecret
        + "api_version" + self.apiVersion
        + "app_key" + self.appKey
        + (param.length > 0 ? "param_json" + param : "")
        + "timestamp" + requestDataStamp
        + self.appSecret;
    console.log("待签名字符串：" + signStr);
    var ciphetext = CryptoJS.MD5(signStr);//获得一个CryptoJS.lib.WordArray对象
    ciphetext = CryptoJS.enc.Hex.stringify(ciphetext);  // 转成16进制字符串
    var sign = ciphetext.toUpperCase();        //转成大写
    console.log("签名为：" + sign);
    return sign;
  }

  function verificationSign1_2(data) {
    var shasign = new HmacSha1Sign(CryptoJS.enc.Utf8.parse(self.appSecret));
    data = data || "";
    console.log(data);

    if (!data) throw '验证签名失败！';
    if(typeof(data)==="string"){
      try {
        data = JSON.parse(data);
      } catch(e){
        throw '验证签名失败！';
      }
    }
    if (data.data) {
      var value = shasign.verifySign(CryptoJS.enc.Base64.parse(data.data || ""));
      data.data = value.toString(CryptoJS.enc.Base64);
      console.log("验证签名" + data.data);
    } else if (data.MSG) {
      alert('验证签名失败！' + data.MSG);
      throw '验证签名失败！' + data.MSG;
    }
    return data;
  }
  
  function getQueryString(url) {
      if (url.indexOf('?') < 0) return "";
      return url.substr(url.indexOf('?') + 1);
  }
  
  function BuildUriPath(template, uriParameters) {
    if(!uriParameters) return template;
    var path = template;
    if(path.indexOf('?')<0)
      path+="?";

    if(typeof(uriParameters)==="string"){
      return path+uriParameters;
    }

    var index=0;
    for (var name in uriParameters) {
      var parameterValue = uriParameters[name];

      var valueType =typeof(parameterValue);
      if(valueType==="function") continue;
      if (valueType==="object") {
        parameterValue = JSON.stringify(parameterValue);
      }
      if(index++!=0){
        path+="&";
      }
      path+=name+"="+parameterValue;
    }
    
    return path;
  }
  
  // 获取密文
  function GetCiphetext(wordArray) {
      var words = wordArray.words;
      var sigBytes = wordArray.sigBytes;
      words = words.slice(5, words.length);
      return new CryptoJS.lib.WordArray.init(words, sigBytes - 20);
  }
  // 获取正文中的签名
  function GetSign(wordArray) {
      var words = wordArray.words;
      var sigBytes = wordArray.sigBytes;
      words = words.slice(0, 5);
      return new CryptoJS.lib.WordArray.init(words, 20);
  }
}