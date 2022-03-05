// pages/user/user.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../icons/user-unlogin.png',
    nickName:"用户未登陆",
    city:"未知",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              let { avatarUrl, city, nickName } =res.userInfo
              this.setData({
                avatarUrl, city, nickName
              })
            }
          })
        }
      }
    });

/*     const db = wx.cloud.database()
    db.collection('zhihu_daily')
      .get()
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.error(err)
      }) */

  },


  getUserInfomation: function (event) {
    

    console.log(event)
    let { avatarUrl, city, nickName}= event.detail.userInfo
    avatarUrl = avatarUrl.split("/")
    avatarUrl[avatarUrl.length - 1] = 0;
    avatarUrl = avatarUrl.join('/');
    this.setData({
      avatarUrl,city, nickName
    })
  },
})