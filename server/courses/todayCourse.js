var schedule = require('node-schedule.js')
var sms = require('../utils/sms.js')

var notifyNextDayCourse = function () {
  console.log("检查明天的课程")
}

var notifyTodayCourse = function () {
  console.log("检查今天的课程")
}

var start = function() {
  var rule = new schedule.RecurrenceRule()
  rule.dayOfWeek = [0, new schedule.Range(0, 6)]

  rule.hour = 17
  rule.minute = 0
  schedule.scheduleJob(rule, notifyNextDayCourse)

  rule.hour = 8
  schedule.scheduleJob(rule, notifyTodayCourse)
}

module.exports = {
  start: start
}
