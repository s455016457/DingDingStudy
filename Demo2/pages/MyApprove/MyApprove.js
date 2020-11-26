
import dateExtend from '/util/dateExtend';

Page({
  data: {
    searchValue:'',
    wFStatus:'R',
    approveList:[]
  },
  onLoad() {},
  onReady(){
    this.searchMyApprove();
  },
  onPullDownRefresh(){
    this.searchMyApprove();
  },
  handleSearch(e){
    console.log('search', e.detail.value);
    this.setData({
      searchValue: e.detail.value,
    });
  },
  doneSearch() {
    console.log('doneSearch', this.data.searchValue);
    dd.hideKeyboard();
    this.searchMyApprove();
  },
  clearSearch() {
    console.log('clear search', this.data.searchValue);
    this.setData({
      searchValue: '',
    });
  },
  searchMyApprove(){
    let client = getApp().SwerpApiClient;
    var self = this;
    client.doPost("/api/Approve/SearchMyApprove","",this.getSearchData(),function(res){
      self.setData({
        approveList:res.data.data
      });
      console.log(self.data.approveList);
    });
  },
  getSearchData(){
    return {
      DocEntry:this.data.doneSearch||"",
      ModelId:this.data.modelId||"",
      WFStatus:this.data.wFStatus||"",
      UserId:getApp().UID
    };
  },
  gotToApprove(d){
    console.log("gotToApprove",d);
  },
  shwoDetail(d){
    console.log("shwoDetail",d);
  }
});
