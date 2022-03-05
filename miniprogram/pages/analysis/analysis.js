// pages/analysis/analysis.js
import { callFunction } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [{
      color:"#D24D57",
      typeName: "运动",
      content: [{
        key: "最喜欢的运动:",
        value:"篮球"
      },
      {
        key: "时长:",
        value:"5H"
      },
      {
        key: "荣耀称号:",
        value:"运动王子"
      }
      ]
    }
      
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    callFunction({
      name: "card",
      data: {
        op:'get',
      }
    }).then(res => {
      console.log(res);

      this.setData({
        info: res.result.data,

      })
      
      
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      console.log(11)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return {
      title: '记All - 守护最棒的你',
      path: '/page/news-detail'
    }
  }
})