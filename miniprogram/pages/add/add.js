// pages/editor/editor.js
import { callFunction } from "../../request/index.js";
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  
  
  /**
   * 页面的初始数据
   */
  data: {
    addTag:"",
    textarea:{maxHeight: 200, minHeight: 100 },
    tag_choose: [
      ],
    tags: [
      {
        name: "学习",
        id:1
      }
    ],
    showTag:false,


    record: {
      time: "",
      
      
    },
    showCalendar:false
    
  },

  QueryParams:{
    type:"",
    
  },
  onCancelClick() {
    wx.navigateBack()
  },
  onAddTag(e) {
    let tags = this.data.tags

    tags.push({ name: this.data.addTag })
    this.setData({
      tags
    })
    
    callFunction({
      name: "tag",
      data: {
        op: 'add',
        type: this.data.record.type,
        tags:{ name: this.data.addTag }

      }
    })

    this.setData({
      addTag:''
    })
    
  },

  onTitleDefault() {
    Toast('记ALL会给您自动生成标题哦~');
  },
  onTagInputClick(e) {

    this.setData({ showTag: true })

  },
  onTagClose() {
    this.setData({ showTag: false })
  },
  onTagItemClick(e) {


      let id = e.currentTarget.dataset.index
      let tag_choose = this.data.tag_choose
      let tags = this.data.tags

      tag_choose.push(tags[id])

      
      tags.splice(id,1);

      this.setData({
        tag_choose,tags
      })
    

    
    

  },
  onTagItemClose(e) {

    let id = e.currentTarget.dataset.index
    let tag_choose = this.data.tag_choose
    let tags = this.data.tags


    tags.push(tag_choose[id])

    tag_choose.splice(id, 1)
    this.setData({
      tag_choose,tags
    })
  },

  onDeleteTag(e) {

    let id = e.currentTarget.dataset.index
    let name = this.data.tags[id].name
    Dialog.confirm({
      zIndex:999,
      
      title: '提示',
      message: '是否删除 '+ name +' 标签',
    })
      .then(() => {
        
        let tags = this.data.tags
        tags.splice(id, 1)
        this.setData({tags})

        callFunction({
          name: "tag",
          data: {
            op: 'delete',
            type: this.data.record.type,
            name:name
    
          }
        })
      })
      .catch(() => {
        // on cancel
      });
  },



  /**
   * 生命周期函数--监听页面加载
   */

   onReady:function(){
     

    callFunction({
      name: "tag",
      data: {

        op: 'get',
        type:this.data.record.type.type


      }
    }).then(res => {
      let tags = res.result.data[0].tags
      let tag_choose = this.data.tag_choose


      tags = tags.filter((x) => !tag_choose.some((item) => x.name === item.name));


      this.setData({
        tags
      })
    })
  },
  onShow: function () {
    
  },
  onLoad: function (options) {
    var that = this
    this.QueryParams.type = options.type || "add";
    
    

    if (this.QueryParams.type == "edit") {

      wx.getStorage({
        key: 'editRecord',
        success: function (res) {
          var record = res.data

          
          
          
          
          that.setData({
            record: record,

            
            
          })

          

          that.setData({
            tag_choose:that.data.record.tag
          })
          
          

        },
      })
      


      
      
    }else if(this.QueryParams.type=="add"){
      let type = options.addtype
      this.setData({
        ['record.time']: this.getFormatDate(new Date()),
      })

      wx.getStorage({
        key: 'type_list',
        success: (result) => {
          this.setData({
            ['record.type']:result.data.find(item => item.type == type )
          })
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });

    }



  },
  onTagChange(e) {
    this.setData({
      tagActiveNames:e.detail
    })
  },
  editorSubmit(e) {

    
    let record = e.detail.value
    record.tag = this.data.tag_choose
    record.type = this.data.record.type

    let op = this.QueryParams.type == 'add' ? 'add' : 'update';

    callFunction({
      name: "record",
      data: {
        op: op,
        _id:this.data.record._id,
        ...record

      }
    }).then(res => {
      wx.setStorageSync('refresh', true);
      wx.switchTab({
        url: '../index/index',
      });
    })

    
      
    
    
    
      
      
    
  },

  getStepTap: function (event) {
    this.get_step()
  },


  get_step: function () {
    var that = this
    wx.getWeRunData({
      success:function(resRun){
        console.log("微信运动密文：")
        console.log(resRun)
        wx.cloud.callFunction({
          name:'test',//云函数的文件名
          data:{
            weRunData: wx.cloud.CloudID(resRun.cloudID),
            obj:{
              shareInfo: wx.cloud.CloudID(resRun.cloudID)
            }
          },
          success: function (res) {
            console.log("云函数接收到的数据:")
            console.log(res)
            let step = res.result.event.weRunData.data.stepInfoList[30].step
            that.setData({
              ['record.num']:step
            })
            console.log("得到的今日步数：",that.data.step)
          },
          fail: function (res) {
            console.log(res);
          }
        })
      }
    })
  },

  onTimeChange() {
    console.log(111);
    this.setData({ showCalendar: true });
  },
  onCalendarClose() {
    this.setData({ showCalendar: false });
  },
  getFormatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  },
  onCalendarConfirm(event) {
    
    this.setData({
      showCalendar: false,
      ['record.time']: this.getFormatDate(event.detail),
    });
  }
  


})