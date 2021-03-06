import lifecycle from '/util/lifecycle';

Page({
  ...lifecycle,
  data:{
    grid:{
      onItemTap:"onGridItemTap",
      list:[{
        entitle:'Collapse',
        icon:'/image/biz_collapse.png',
        title:'我的折叠面板',
        page:'/page/MyDemo/Collapse/index'
      },{
        entitle:'chengfatable',
        icon:'/image/biz_item1.png',
        title:'乘法表',
        page:'/page/MyDemo/chengfatable/index'
      },{
        entitle:'SignalR',
        icon:'/image/biz_item1.png',
        title:'SignalR',
        page:'/page/MyDemo/SignalR/index'
      },{
        entitle:'item3',
        icon:'/image/biz_item1.png',
        title:'item3',
        page:''
      },{
        entitle:'item4',
        icon:'/image/biz_item1.png',
        title:'item4',
        page:''
      },{
        entitle:'item5',
        icon:'/image/biz_item1.png',
        title:'item5',
        page:''
      },{
        entitle:'item6',
        icon:'/image/biz_item1.png',
        title:'item6',
        page:''
      },{
        entitle:'item6',
        icon:'/image/biz_item1.png',
        title:'item7',
        page:''
      },{
        entitle:'item6',
        icon:'/image/biz_item1.png',
        title:'item8',
        page:''
      },{
        entitle:'item6',
        icon:'/image/biz_item1.png',
        title:'item9',
        page:''
      },{
        entitle:'item6',
        icon:'/image/biz_item1.png',
        title:'item10',
        page:''
      }]
    },
  },
  onGridItemTap(e) {
    var app = getApp();
    const page = this.data.grid.list[e.currentTarget.dataset.index].page;
    console.log("onGridItemTap--page",page);
    console.log("onGridItemTap--page",app,app.globalData);
    dd.navigateTo({ url: page });
  },
});
