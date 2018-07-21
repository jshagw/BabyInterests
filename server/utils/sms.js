var QcloudSms = require("qcloudsms_js")
var {sms: config} = require("../config.js")

var qcloudsms = QcloudSms(config.AppID, config.AppKey)

// 单发文本短信
var ssendPlainText = function (phoneNumber, plainText, callback) {
  var ssender = qcloudsms.SmsSingleSender()
  ssender.send(0, 86, phoneNumber, plainText, "", "", callback)
}

// 单发模板短信
var ssendTemplate = function (templateId, phoneNumber, params, callback) {
  var ssender = qcloudsms.SmsSingleSender()
  ssender.sendWithParam(86, phoneNumber, templateId, params, "", "", "", callback)
}

// 群发文本短信
var msendPlainText = function (templateId, phoneNumbers, plainText, callback) {
  var ssender = qcloudsms.SmsMultiSender()
  ssender.sendWithParam(0, "86", phoneNumbers, templateId, plainText, "", "", callback)
}

// 群发模板短信
var msendTemplate = function (templateId, phoneNumbers, params, callback) {
  var ssender = qcloudsms.SmsMultiSender()
  ssender.sendWithParam("86", phoneNumbers, templateId, params, "", "", "", callback)
}

module.exports = {
  ssendPlainText: ssendPlainText,
  ssendTemplate: ssendTemplate,
  msendPlainText: msendPlainText,
  msendTemplate: msendTemplate
}
