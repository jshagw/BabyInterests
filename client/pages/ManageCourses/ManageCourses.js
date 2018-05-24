
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
      url: config.service.courseUrl,
      method: "GET",
      login: false,
      data: params,
      success(result) {
        console.log("courses:", result.data.data)
        that.setData({ courses: result.data.data })
        /*that.setData({
          courses: [
            {
              id: 1,
              institution_name: "科蒂学科英语",
              course_name: "英语",
              begin_date: "2015-05-12",
              end_date: "2016-05-11"
            },
            {
              id: 2,
              institution_name: "正能量体育",
              course_name: "篮球",
              begin_date: "2015-05-12",
              end_date: "2016-05-11"
            },
            {
              id: 3,
              institution_name: "正能量体育",
              course_name: "篮球",
              begin_date: "2015-05-12",
              end_date: "2016-05-11"
            },
            {
              id: 4,
              institution_name: "正能量体育",
              course_name: "篮球",
              begin_date: "2015-05-12",
              end_date: "2016-05-11"
            }
          ]})*/
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
