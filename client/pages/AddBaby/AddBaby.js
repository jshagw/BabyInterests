//AddBaby.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var baby = require('../../utils/baby.js')

Page({
  data: baby.get(),

  onLoad : function(options) {
    
  },

  onShow : function() {
    
  },

  submit: function (event) {
    console.log(event.detail.value)
    var params = event.detail.value

    if (params.name === "") {
      util.showModel("输入错误", "名称不能为空")
      return
    }

    if (this.data.id !== '') {
      params['id'] = this.data.id
    }

    qcloud.request({
      url: config.service.babyUrl,
      method: 'POST',
      login: false,
      data: params,
      success(result) {
        util.showSuccess('设置成功')
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];  //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.getBabyInfo()
        wx.navigateBack()
      },

      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  },

  selectSex: function (event) {
    this.setData({ sex: event.detail.value})
  },

  selectBirthday : function (event) {
    this.setData({birthday: event.detail.value})
  },

  shareBaby : function (event) {
    var that = this
    wx.scanCode({
      scanType: 'qrCode',
      success: function (res) {
        var info = JSON.parse(res.result)

        console.log(info)

        if ( !info.id || !info.name ) {
          return
        }

        wx.navigateTo({
          url: '../ShareBaby/ShareBaby?baby_id=' + that.data.id
            + '&baby_name=' + that.data.name
            + '&user_id=' + info.id
            + '&user_name=' + info.name,
        })
      }
    })
  }
})
