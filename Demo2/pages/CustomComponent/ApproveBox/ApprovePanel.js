Component({
  mixins: [],
  data: {
    IsLastStep:false,         // 是最后一个步骤
    HasNoPassAction:false,     // 拥有拒绝行为
    HasPassAction:false,       // 拥有批准行为
    PreStepName:"",           // 前一步审批步骤名称
    PreApproveByUserName:"",  // 前一步终审人名称
    PreApproveRemark:"",      // 前一步审批备注
    PreApproveStamp:"",       // 前一步审批时间
    AproveRemark:"",          // 审批备注
  },
  props: {
    ApproveId:"", // 单据审批ID
    StepId:"",    // 审批步骤ID
    UserId:"",    // 审批人
  },
  didMount() {
    var self = this;
    var data={
      ApproveId:self.props.ApproveId,
      StepId:self.props.StepId,
      UserId:self.props.UserId,
    };
    var cliten = getApp().SwerpApiClient;
    cliten.doGet("/api/Approve/GetPreviousApproveLog",data,"",function(res){
      if(res&&res.data&&res.data.data)
        self.setData({
          StepName:res.data.data.PreStepName,
          PreApproveByUserName:res.data.data.ApproveByUserName,
          PreApproveRemark:res.data.data.Remark,
          PreApproveStamp:res.data.data.ApproveStamp,
        });
      else
        self.setData({
          StepName:"",
          PreApproveByUserName:"",
          PreApproveRemark:"",
          PreApproveStamp:"",
        });
    });
    cliten.doGet("/api/Approve/GetApproveDocStepAction",data,"",function(res){
      if(res&&res.data&&res.data.data)
        self.setData({
          IsLastStep:res.data.data.IsLastStep,
          HasNoPassAction:res.data.data.HasNoPassAction,
          HasPassAction:res.data.data.HasPassAction,
        });
    });
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    approve(){
      var self = this;
      var data={
        ApproveId:self.props.ApproveId,
        StepId:self.props.StepId,
        UserId:self.props.UserId,
        WFStatus:'Y',
        Remark: this.data.Remark
      };
      var cliten = getApp().SwerpApiClient;

      cliten.doPost("/api/Approve/Approve","",data,function(res){
        if(res&&res.data&&res.data.data)
         {
           dd.confirm({
            title: '温馨提示',
            content: '批准成功',
            confirmButtonText: '返回审批列',
            cancelButtonText: '留在该界面',
            success: (result) => {
              self.setData({HasPassAction:false});
              if(result.confirm){
                dd.navigateBack(1);
              }
            },
          });
         }
      });
    },
    refuse(){
      var self = this;
      var data={
        ApproveId:self.props.ApproveId,
        StepId:self.props.StepId,
        UserId:self.props.UserId,
        WFStatus:'D',
        Remark: this.data.Remark
      };
      var cliten = getApp().SwerpApiClient;

      cliten.doPost("/api/Approve/Approve","",data,function(res){
        if(res&&res.data&&res.data.data)
         {
           dd.confirm({
            title: '温馨提示',
            content: '拒绝成功',
            confirmButtonText: '返回审批列',
            cancelButtonText: '留在该界面',
            success: (result) => {
              if(!self.data.IsLastStep)
                self.setData({HasNoPassAction:false});

              if(result.confirm){
                dd.navigateBack(1);
              }
            },
          });
         }
      });
    },
    goToApproveHistory(){
      var url = "/pages/CustomComponent/ApproveBox/ApproveHistoryPanel?ApproveId="+this.props.ApproveId;
     dd.navigateTo({
       url:url
     }); 
    }
  },
});
