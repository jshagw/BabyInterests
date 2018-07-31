var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var session = require('../../vendor/wafer2-client-sdk/lib/session.js')
var QR = require('../../utils/qrcode.js')
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
    inputPhone:"",
    canvasHidden: false,
    maskHidden: true,
    imagePath: ''
  },

  submit: function(event) {
    var params = event.detail.value
    console.log(params)

    if ( params.phone === "" ) {
      util.showModel("输入错误", "手机号码不能为空")
      return
    }

    if (params.code === "") {
      util.showModel("输入错误", "验证码不能为空")
      return
    }

    // 判断手机号码格式
    var reg = /^1\d{10}$/
    if (!reg.test(params.phone)) {
      util.showModel("输入错误", "手机号码格式不正确")
      return
    }



    qcloud.request({
      url: config.service.phoneUrl,
      method: "POST",
      login: false,
      data: params,
      success(result) {
        util.showSuccess('设置成功')
        wx.navigateBack()
      },

      fail(error) {
        util.showModel('请求失败', error.message)
        console.log('request phone fail', error)
      }
    })
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
        //console.log("phone:", result.data.data)
        that.setData({ phoneNumber: result.data.data[0].phone })
        //console.log(that.data.phoneNumber)
      },

      fail(error) {
        util.showModel('请求失败', error)
        console.log('request phone fail', error)
      }
    })
  },

  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 500;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },

  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
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
    var size = this.setCanvasSize();//动态设置画布大小
    //调用插件中的draw方法，绘制二维码图片
    var initUrl = session.get()
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
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