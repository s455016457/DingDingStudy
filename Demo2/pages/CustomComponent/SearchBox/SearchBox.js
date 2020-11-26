Component({
  oldValue:'',
  mixins: [],
  data: {
    _value:'',
    enableSearchButton:true,
    enableAdvancedbutton:true,
    showAdvancedViewTitle:true,
    animMaskData: [],
    animContentData: [],
    hidden:true,
  },
  // 我们希望自定义组件与外界不是隔离的。目前为止它是一个独立的模块，想让它与外界交流，那就需要让它可以接受外界的输入，然后做完处理之后，还可以通知外界说：我做完了。这些都可以通过 props 来实现。
  props: {
    value:'',
    placeholder:'查询条件',
    showAdvancedButotn:true,
    advancedButotnText:"高级查询",
    shwoSearchButton:true,
    searchButtonText:"查询",
    onSearch(data){
      console.log("onSearch 查询",data);
    },
    onChange(oldValue,newValue){
    }
  },
  didMount(e) {
    console.log("SearchBox component do didMount： 为渲染后回调，此时页面已经渲染，通常在这里请求服务端数据比较合适。",e);
    this.setData({
      _value:this.props.value,
      enableSearchButton:this.parseBoolean(this.props.shwoSearchButton||true),
      enableAdvancedbutton:this.parseBoolean(this.props.showAdvancedButotn||true),
    })
  },
  didUpdate(e) {
    var oldV = this.oldValue;
    this.oldValue=e.value;
    console.log("SearchBox component do didUpdate：更新后回调，每次组件数据变更的时候都会调用",e);
    if(this.props.onChange)
    this.props.onChange(oldV,e.value);
  },
  didUnmount(e) {
    console.log("SearchBox component do didUnmount：为删除后回调，每当组件示例从页面删除的时候会触发此回调",e);
  },
  methods: {
    onChange(e){
      console.log("onChange");
      this.setData({
        _value: e.detail.value,
      });
    },
    onClickAdvanced(e){
      if(this.props.doAdvanced&&!this.props.doAdvanced(this.data._value))
        return;
        
      this.setData({
        hidden: !this.data.hidden,
      });
      this.createMaskShowAnim();
      this.createContentShowAnim();
    },
    onDoSearch(e){
      if(this.props.onSearch)
        this.props.onSearch(this.data._value);
    },
    clearSearch(e){
      this.setData({
        _value:""
      });
    },
    parseBoolean(value){
      switch(typeof(value)){
        case "boolean":
          return value;
        case "string":
          if(value.length===0||value.toUpperCase()==="FALSE")
            return false;
          return true;
        case "number":
            return value>0
        case "undefined":
        case "object":
        default:
          return new Boolean(value);
      }
    },
    createMaskShowAnim() {
      const animation = dd.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
      });

      this.maskAnim = animation;
  
      animation.opacity(1).step();
      this.setData({
        animMaskData: animation.export(),
      });
    },
    createMaskHideAnim() {
      this.maskAnim.opacity(0).step();
      this.setData({
        animMaskData: this.maskAnim.export(),
      });
    },
    createContentShowAnim() {
      const animation = dd.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
      });  
      this.contentAnim = animation;  
      animation.translateY(0).step();
      this.setData({
        animContentData: animation.export(),
      });
    },
    createContentHideAnim() {
      this.contentAnim.translateY('100%').step();
      this.setData({
        animContentData: this.contentAnim.export(),
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
  },
});
