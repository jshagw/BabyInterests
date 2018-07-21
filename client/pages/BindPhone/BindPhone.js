var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var interval = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:null,
    disabled: false,
    verifyText: "获取验证码",
    currentTime: 61,
    inputPhone:""
  },

  submit: function(event) {
    console.log(event.detail.value)
    var params = event.detail.value
  },

  confirmPhoneNumber: function(event) {
    var phone = event.detail.value
    var that = this

    if ( phone !== that.data.inputPhone ) {
      this.setData({
        inputPhone: event.detail.value
      })
    }
  },

  getVerificationCode: function() {
    var that = this;
    var currentTime = that.data.currentTime
    var phoneNumber = that.data.inputPhone

    // 判断手机号码格式
    var reg = /^1\d{10}$/
    if ( !reg.test(phoneNumber) ) {
      util.showModel("输入错误", "手机号码格式不正确")
      return
    }

    // 获取验证码
    qcloud.request({
      url: config.service.verificationUrl,
      method: "GET",
      login: false,
      data: {phoneNumber:phoneNumber},
      success(result) {
        interval = setInterval(function () {
          currentTime--;
          that.setData({
            verifyText: currentTime + '秒'
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              verifyText: '重新发送',
              currentTime: 61,
              disabled: false
            })
          }
        }, 1000)

        that.setData({
          disabled: true
        })
      },

      fail(error) {
        util.showModel('请求失败', error)
        console.log('request phone fail', error)
      }
    })
  },

  getPhoneNumber: function() {
    var that = this
    qcloud.request({
      url: config.service.phoneUrl,
      method: "GET",
      login: false,
      success(result) {
        console.log("phone:", result.data.data)
        that.setData({ phoneNumber: result.data.data[0] })
      },

      fail(error) {
        util.showModel('请求失败', error)
        console.log('request phone fail', error)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPhoneNumber()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
    
  }
})