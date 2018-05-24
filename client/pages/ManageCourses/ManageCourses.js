
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var baby = require('../../utils/baby.js')

Page({
  data: {
    courses: []
  },

  getCourses: function() {
    var that = this
    var params = {baby_id : baby.get().id}
    qcloud.request({
      url: config.service.interestUrl,
      method: "GET",
      login: false,
      data: params,
      success(result) {
        console.log("courses:", result.data.data)
        that.setData({ courses: result.data.data })
      },

      fail(error) {
        util.showModel('请求失败', error)
        console.log('request baby fail', error)
      }
    })
  },
  
  onLoad: function() {
    this.getCourses()
  }
})
