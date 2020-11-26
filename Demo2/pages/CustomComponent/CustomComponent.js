Page({
  data: {
    searchValue1:'',
    searchValue2:'',
    searchValue3:''
  },
  onLoad() {},
  onAdvancedFilter(data){
    console.log("onAdvancedFilter 高级筛选",data);
  },
  onSearch(data){
    console.log("onSearch 查询",data,this.data);
  },
  changeSearchValue1(e){
    this.setData({
      searchValue1: e.detail.value,
    });
  },
  changeSearchValue2(e){
    this.setData({
      searchValue2: e.detail.value,
    });
  },
  changeSearchValue3(e){
    this.setData({
      searchValue3: e.detail.value,
    });
  }
});
