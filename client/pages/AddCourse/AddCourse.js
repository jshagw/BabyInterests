//AddCourse.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var baby = require('../../utils/baby.js')

var weeks = ["周日","周一","周二","周三","周四","周五","周六"]

Page({
  data: {
    courses: {},
    begin_date: "",
    end_date: "",
    sel_course: "",
    institutions: {},
    course_times: {}
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

    if ( params.course_times.length === 0 ) {
      util.showModel("输入错误", "至少选择一个课程时间")
      return
    }

    var babyInfo = baby.get()
    if (!babyInfo.hasBaby) {
      util.showModel("输入错误", "宝宝还未设置")
      return
    }

    params['baby_id'] = babyInfo.id

    for ( var i = 0; i < params.course_times.length; ++i ) {
      var index = params.course_times[i]
      var time = this.data.course_times[index]
      params.course_times[i] = {
        id: time.id,
        begin: time.begin,
        end: time.end
      }
    }

    qcloud.request({
      url: config.service.interestUrl,
      method: 'POST',
      login: false,
      data: params,
      success(result) {
        util.showSuccess('添加成功')

        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];  //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面

        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          isAddCourse: true
        })
        wx.navigateBack()
      },

      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  },

  initCourseTimes: function() {
    var course_times = []
    for ( var i = 0; i < 7; ++i ) {
      course_times.push({
        id: i,
        name: weeks[i],
        checked: false,
        begin: "00:00",
        end: "24:00"
      })
    }

    this.setData({course_times: course_times})
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
    this.initCourseTimes()
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
  },

  selectBeginTime: function (event) {
    var index = event.currentTarget.id
    var course_times = this.data.course_times
    course_times[index].begin = event.detail.value
    this.setData({ course_times: course_times })
  },

  selectEndTime: function (event) {
    var index = event.currentTarget.id
    var course_times = this.data.course_times
    course_times[index].end = event.detail.value
    this.setData({ course_times: course_times })
  }
})
