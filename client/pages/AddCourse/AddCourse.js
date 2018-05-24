//AddCourse.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var baby = require('../../utils/baby.js')

Page({
  data: {
    courses: {},
    begin_date: "",
    end_date: "",
    sel_course: "",
    institutions: {}
  },

  submit: function (event) {
    console.log(event.detail.value)
    var params = event.detail.value

    if (!params.course_id) {
      util.showModel("输入错误", "请选择课程")
      return
    }

    if (!params.institution_id) {
      util.showModel("输入错误", "请选择培训机构")
      return
    }

    if (!params.begin_date) {
      util.showModel("输入错误", "请选择开始日期")
      return
    }

    if (!params.end_date) {
      util.showModel("输入错误", "请选择结束日期")
      return
    }

    if ( params.begin_date >= params.end_date ) {
      util.showModel("输入错误", "开始日期要小于结束日期")
      return
    }

    var babyInfo = baby.get()
    if (!babyInfo.hasBaby) {
      util.showModel("输入错误", "宝宝还未设置")
      return
    }

    params['baby_id'] = babyInfo.id

    qcloud.request({
      url: config.service.interestUrl,
      method: 'POST',
      login: false,
      data: params,
      success(result) {
        util.showSuccess('添加成功')
        wx.navigateTo({url: "../ManageCourses/ManageCourses"})
      },

      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  },

  getCourses: function() {
    var that = this
    qcloud.request({
      url: config.service.courseUrl,
      method: "GET",
      login: false,
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

  getInstitutions : function(courseId) {
    var that = this
    qcloud.request({
      url: config.service.institutionUrl,
      method: "GET",
      login: false,
      data: {course_id : courseId},
      success(result) {
        console.log("institutions:", result.data.data)
        that.setData({
          institutions: result.data.data
        })
      },

      fail(error) {
        util.showModel('请求失败', error)
        console.log('request baby fail', error)
      }
    })
  },

  selectCourse: function (event) {
    var courseId = event.detail.value
    this.setData({ 
      sel_course: courseId
    })
    this.getInstitutions(courseId)
  },

  selectBeginDate: function(event) {
    this.setData({begin_date: event.detail.value})
  },

  selectEndDate: function (event) {
    this.setData({ end_date: event.detail.value })
  }
})
