
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
  },

  deleteCourse: function(id) {
    qcloud.request({
      url: config.service.interestUrl,
      method: "DELETE",
      login: false,
      data: {id: id},
      
      success(result) {
        util.showSuccess('删除成功')
        wx.navigateTo({
          url: './ManageCourses',
        })
      },

      fail(error) {
        util.showModel('请求失败', error)
      }
    })    
  },

  longPressCourse: function(event) {
    var index = event.currentTarget.id
    var course = this.data.courses[index]
    var that = this
    wx.showActionSheet({
      itemList: ['设置上课时间','删除'],
      success: function(res) {
        switch ( res.tapIndex ) {
          case 0: {
            // 设置上课时间
            break
          }
          case 1: {
            // 删除课程
            wx.showModal({
              title: '',
              content: '确定删除【' + course.course_name + '】吗？',
              success: function (res) {
                if (res.confirm) {
                  that.deleteCourse(course.id)
                }
              }
            })
            break
          }
        }
      }
    })
  }
})
