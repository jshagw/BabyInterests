//AddBaby.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    sex: '1',
    birthday: "2013-04-15"
  },

  submit: function (event) {
    console.log(event.detail.value)
    var params = event.detail.value

    if (params.input_name === "") {
      util.showModel("输入错误", "名称不能为空")
      return
    }

    qcloud.request({
      url: config.service.babyUrl,
      method: 'POST',
      login: false,
      success(result) {
        util.showSuccess('设置成功')
        console.log(result.data.data)
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
  }
})
