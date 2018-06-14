var QcloudSms = require("qcloudsms_js")
var {sms: config} = require("../config.js")

var qcloudsms = QcloudSms(config.AppID, config.AppKey)

var send = function(phoneNumbers, params, callback) {
  var ssender = qcloudsms.SmsSingleSender()
  ssender.sendWithParam(86, phoneNumbers, config.templateId, params,
                        "", "", "", callback)
}

module.exports = {
  send: send
}
