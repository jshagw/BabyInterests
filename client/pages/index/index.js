//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var baby = require('../../utils/baby.js')

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        babyInfo: baby.get(),
        requestBabyInfoFailed: false
    },

    // 获取宝宝信息
    getBabyInfo: function() {
      var that = this
      qcloud.request({
        url: config.service.babyUrl,
        method: "GET",
        login: false,
        success(result) {
          var babyInfos = result.data.data
          //console.log("baby", result.data.data)
          if ( babyInfos.length > 0 ) {
            baby.set(babyInfos[0])
            that.setData({ babyInfo: baby.get() })
          }
        },

        fail(error) {
          console.log('request baby fail', error)
          that.setData({ requestBabyInfoFailed: true})
        }
      })
    },

    // 用户登录示例
    login: function(callback) {
        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })

                    callback(true)
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })

                            callback(true)
                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },

    onLoad: function () {
      var that = this
      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接登录
            that.login(function(result) {
              if ( result ) {
                // 获取宝宝信息
                that.getBabyInfo()

                if (!that.data.userInfo.phone || that.data.userInfo.phone === "") {
                  wx.navigateTo({
                    url: "../BindPhone/BindPhone?name=" + that.data.userInfo.nickName
                  })
                }
              }
            })
          }
        }
      })
    },

    bindGetUserInfo: function (e) {
      //console.log(e.detail.userInfo)
    },

    bindPhoneNumber: function () {
      var that = this
      wx.navigateTo({
        url: "../BindPhone/BindPhone?name=" + this.data.userInfo.nickName
      })
    }
})
