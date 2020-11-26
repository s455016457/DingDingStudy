import lifecycle from '/util/lifecycle';
import animModal from '/util/items';


Page({
  ...lifecycle,
  data: {
    pageName: 'component/index',
    pageInfo: {
      pageId: 0,
    },
    hidden: true,
    curIndex: 0,
    arr: {
      onItemTap: 'onGridItemTap',
      list: [ {
          icon: '/image/myApprove.png',
          title: '我的批阅',
          page:'MyApprove',
        }, {
          icon: '/image/agent.png',
          title: '设置代理人',
          page:'ApproveUser',
        },{
          icon: '/image/chengfabiao.png',
          title: '乘法表',
          page:'chengfabiao',
        },{
          icon: '/image/customComponent.png',
          title: '自定义组件',
          page:'CustomComponent',
        },{
          icon: '/image/upload.png',
          title: '上传照片',
          page:'UploadFile',
        },{
          icon: '/image/setting.png',
          title: '设置',
          page:'setting',
        }
      ],
    },
  },
  onGridItemTap(e) {
    const curIndex = e.currentTarget.dataset.index;
    const childList = this.data.arr.list[curIndex];
    var page = childList.page;
    dd.navigateTo({
      url: `/pages/${childList.page}/${childList.page}`,
    });
  },
  onModalCloseTap() {
    this.createMaskHideAnim();
    this.createContentHideAnim();
    setTimeout(() => {
      this.setData({
        hidden: true,
      });
    }, 210);
  },
});
