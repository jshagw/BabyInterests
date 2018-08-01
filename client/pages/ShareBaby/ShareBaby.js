//ShareBaby.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    baby_id: '',
    baby_name: '',
    user_name: '',
    user_id: ""
  },

  onLoad: function (options) {
    this.setData({
      baby_id: options.baby_id,
      baby_name: options.baby_name,
      user_id: options.user_id,
      user_name: options.user_name
    })
  },

  submit: function (event) {
    var that = this
    var params = event.detail.value
    var relations = ["未知关系","爸爸","妈妈","爷爷","奶奶"]

    wx.showModal({
      title: '宝宝兴趣',
      content: '是否与【' + relations[params.relation] + '】【' + that.data.user_name + '】共享宝宝？',
      cancelText: '否',
      confirmText: '是',
      success: function (result) {
        if (result.confirm) {
          qcloud.request({
            url: config.service.shareBabyUrl,
            method: 'POST',
            login: false,
            data: {
              id: that.data.user_id,
              baby: that.data.baby_id,
              relation: params.relation
            },
            success(result) {
              util.showSuccess('共享成功')
              wx.navigateBack()
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })    
        }
      }
    })
  },

  cancel: function(event) {
    wx.navigateBack()
  }
})
