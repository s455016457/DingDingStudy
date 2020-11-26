// Component({
//   mixins: [],
//   data: [],
//   props: {
//     ApproveId:"", // 单据审批ID
//   },
//   didMount() {
//     var self = this;
//     var data={
//       ApproveId:self.props.ApproveId,
//     };
//     var cliten = getApp().SwerpApiClient;
//     cliten.doGet("/api/Approve/GetApproveHistory",data,"",function(res){
//       if(res&&res.data&&res.data.data)
//         self.setData(res.data.data);
//       else
//         self.setData([]);
//     });   
//   },
//   didUpdate() {},
//   didUnmount() {},
//   methods: {
    
//   },
// });


Page({
  data: {
    ApproveId:"", // 单据审批ID
    data:[]
  },
  onLoad(query) {
    console.log(query);
    var self = this;
    self.setData({ApproveId:query.ApproveId});
    var data={
      ApproveId:this.data.ApproveId,
    };
    var cliten = getApp().SwerpApiClient;
    cliten.doGet("/api/Approve/GetApproveHistory",data,"",function(res){
      if(res&&res.data&&res.data.data)
        self.setData({data:res.data.data});
      else
        self.setData({data:[]});
    });  
  }
});
