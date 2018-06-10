
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var baby = require('../../utils/baby.js')

Page({
  data: {
    courses: {},
    isAddCourse: false,
    delBtnWidth: 180
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

  getEleWidth: function (w) {
    var real = 0;

    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },

  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);

    this.setData({
      delBtnWidth: delBtnWidth
    })
  },
  
  onLoad: function() {
    this.initEleWidth()
    this.getCourses()
  },

  onShow: function(options) {
    if (this.data.isAddCourse) {
      this.getCourses()
      this.setData({ isAddCourse: false })
    }
  },

  deleteCourse: function(e) {
    var index = e.currentTarget.dataset.index
    var courses = this.data.courses
    var that = this
    var course = this.data.courses[index]

    qcloud.request({
      url: config.service.interestUrl,
      method: "DELETE",
      login: false,
      data: {id: course.id},
      
      success(result) {
        util.showSuccess('删除成功')
        courses.splice(index, 1)
        that.setData({
          courses: courses
        })
      },

      fail(error) {
        util.showModel('请求失败', error)
      }
    })    
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },

  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";

      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if(disX > 0){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }

      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var courses = this.data.courses;

      courses[index].txtStyle = txtStyle;

      //更新列表的状态
      this.setData({
        courses: courses
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var courses = this.data.courses;
      courses[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        courses: courses
      });
    }
  },

  longPressCourse: function(event) {
    var index = event.currentTarget.id
    var course = this.data.courses[index]
    var that = this
    wx.showActionSheet({
      itemList: ['删除'],
      success: function(res) {
        switch ( res.tapIndex ) {
          case 0: {
            // 删除课程
            wx.showModal({
              title: '',
              content: '确定删除【' + course.course_name + '】吗？',
              success: function (res) {
                if (res.confirm) {
                  that.deleteCourse(index)
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
