//CurrentCourse.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var baby = require('../../utils/baby.js')

Page({
    data: {
        coureses: []
    },

    getCurrentCourses: function() {
      var that = this
      var params = { baby_id: baby.get().id }
      qcloud.request({
        url: config.service.dayCourseUrl,
        method: "GET",
        login: false,
        data: params,
        success(result) {
          console.log("current_courses:", result.data.data)
          that.setData({ courses: result.data.data })
        },

        fail(error) {
          util.showModel('请求失败', error)
          console.log('request baby fail', error)
        }
      })
    },

    onLoad: function() {
      this.getCurrentCourses()
    },

    selectCourse: function(event) {
      var index = event.currentTarget.dataset.index
      var course = this.data.courses[index]
      var url = '../CourseComment/CourseComment?id=' + course.id 
                + '&name=' + course.name
      // 参数送到页面的onLoad
      wx.navigateTo({
        url: url,
      })
    }
})
