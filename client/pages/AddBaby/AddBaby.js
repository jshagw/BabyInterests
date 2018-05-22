//AddBaby.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    sex: '1',
    birthday: ''
  },

  getCurrentCourses: function () {

  },

  onLoad: function () {
    this.getCurrentCourses()
  },

  selectSex: function (event) {
    this.setData({ sex: event.detail.value})
  },

  selectBirthday : function (event) {
    this.setData({birthday: event.detail.value})
  }
})
