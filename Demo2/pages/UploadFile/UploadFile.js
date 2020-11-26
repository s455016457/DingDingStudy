Page({
  data: {},
  onLoad() {},
  uploadFile(){
    dd.chooseImage({
      count:1,
      sourceType: ['camera','album'],
      success(filePaths){
        console.log("用户选择的图片：",filePaths);
        const path = (filePaths.filePaths && filePaths.filePaths[0]) || (filePaths.apFilePaths && filePaths.apFilePaths[0]);
        const client = getApp().SwerpApiClient;
        
        var file={
          fileType:'image',
          fileName:'file',
          filePath:path,
        }

        client.doUploadFile("/api/Test/UploadFile","",{ID:123,NAME:'test'},file,function(res){
          console.log("doUploadFile success",res);
        },function(res){
          console.log("doUploadFile fail",res);
        });

        
        // dd.uploadFile({
        //   url: 'http://localhost:8082/api/Test/UploadFile',
        //   fileType: 'image',
        //   fileName: 'file',
        //   filePath: path,
        //   success: res => {
        //     dd.alert({ title: `上传成功：${JSON.stringify(res)}` });
        //   },
        //   fail: function (res) {
        //     dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
        //   },
        // });

      },
      fail(error){
        if(error.error===11){
          dd.showToast({
            content:'取消上传'
          });
        }
      }
    });
  },
});
