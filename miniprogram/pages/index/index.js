//index.js
import { callFunction } from "../../request/index.js";
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    pageIndex: 1,


    detailIndex:0,

    showDetail: false,
    showSearch: false,
    list: [],
    type_list:[],


    active: 0,
    user_id:0



  },
  onDetailClose() {
    this.setData({ showDetail: false });
  },
  showDetail(e) {
    let detailIndex= e.currentTarget.dataset.detailIndex
    this.setData({
      showDetail: true,
      detailIndex
    });
  },
  onSearchBtnClick() {
    if (this.data.isSearchEnd) {
      this.setData({
        list: this.data.OldList,
        isSearchEnd:false
      })

      
    } else {
      let show = this.data.showSearch
      show = !show
      this.setData({
        showSearch:show

      })
    }
    
    
  },
  onSearch(e) {
    let searchVal = e.detail;

    callFunction({
      name: "record",
      data: {
        op:'search',
        value:searchVal
      }
    }).then(res => {
      let OldList = this.data.list

      this.setData({
        list: res.result.data,
        isSearchEnd: true,
        OldList
      })
      
      
    })
    
  },


  onReady: function () {

    
  },
  onShow: function (e) {
    this.getTabBar().init();



    let refresh = wx.getStorageSync('refresh');
    
    if (refresh) {
      this.getRecordList(1).then(res => {
        this.setData({list:res})
      })
      
      

      wx.setStorageSync('refresh',false)
        
    }
    wx.getSetting({
      success: (result)=>{
        console.log();



      },
      fail: ()=>{},
      complete: ()=>{}
    });
      
    var that = this;
    // wx.login({
    //   success:function(resLonin){
        
    //   }
    // })
      
    
      
  },
  async getRecordList(pageIndex) {
    Toast.loading({
      message: '玩命加载中...',
      forbidClick: true,
    }); //提示框

   let res = await callFunction({  //解决回调地狱promise
      name: "record",
      data: {
        op: 'get',
        pageIndex,
        pageSize:7,
        user_id
      }
   })

    Toast.clear() //提示框取消
    return res.result.data //返回promise格式的值
  },
  

  onReachBottom: function (e) {
    this.setData({
      pageIndex:this.data.pageIndex+1
    })
    this.getRecordList(this.data.pageIndex).then(res => {
      let list = this.data.list
      list = list.concat(res)
      this.setData({
        list
      })
    })
    

    
  },
  onLoad: function (e) {
    
    
    wx.getStorage({
      key: 'type_list',
      success: (result)=>{
        this.setData({
          type_list:result.data
        })
      },
      fail: () => {
        callFunction({
          name: "get_type_list",
        }).then(res => {
    
          wx.setStorage({
            key: 'type_list',
            data:res.result.data
          })
          this.setData({
            type_list:res.result.data
          })
        })
      },
      complete: ()=>{}
    });

    var _this = this
    get()
    
    async function get() {
      
      if (!(this.user_id =  wx.getStorageSync('user_id'))) {
        
        await callFunction({ name: 'login' })
          .then(res => {
            wx.setStorage({
              key: 'user_id',
              data: res.result,
            });

          })
        
        
      }
      
      let list = _this.getRecordList(1).then(res => {
        _this.setData({list:res})
      })

      

      
    }
    

    
  },
  
  //tab 点击
  handleTabsItemChange(e) {

    const active = e.detail.index;
    var searchType
    
    if (active != 0) searchType = this.data.type_list[active - 1].title
    else searchType = '全部'
    
    this.setData({
      active,searchType
    })
  },





  listEdit(e) {


    var id = e.currentTarget.dataset.id;
    wx.setStorageSync('editRecord', this.data.list[id])
    wx.navigateTo({
      url: '../add/add?type=edit'
    })
  },




  /**
   * 删除产品
   */
  handleDeleteProduct: function (e) {
    var _id = e.currentTarget.dataset.id;

    let list = this.data.list
    let listitemindex = list.findIndex(item => item._id === _id)


    list.splice(listitemindex, 1)

    this.setData({
      list
    })

    callFunction({
      
      name: "record",
      data: {
        op:'delete',
        _id
      }
    })
  },


})
