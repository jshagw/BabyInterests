var schedule = require('node-schedule')
var sms = require('../utils/sms.js')
const { mysql } = require('../qcloud')
var { sms: config } = require("../config.js")

var NotifyStatuses = {
  today: { day: -1, status: false },
  tomorrow: { day: -1, status: false }
}

var getCoursesOfDay = function(day, dayName, callback) {
  var dayOfWeek = day.getDay()
  var date = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate()
  var fields = "bct.baby_id, b.name as baby_name, c.name as course_name \
                  , date_format(bct.begin_time, '%H:%i') as begin \
                  , date_format(bct.end_time, '%H:%i') as end"
  mysql.select(
    mysql.raw(fields)
  ).from(
    'bi_baby_course_times as bct'
  ).join(
    'bi_baby_courses as bc', 'bc.id', 'bct.baby_course_id'
  ).join(
    'bi_courses as c', 'c.id', 'bct.course_id'
  ).join(
    'bi_babies as b', 'b.id', 'bct.baby_id'
  ).where({
    'bct.day_of_week': dayOfWeek,
    'bc.status': 1
  }).where(
    'bc.begin_date', '<=', date
  ).where(
    'bc.end_date', '>=', date
  ).then(function (rows) {
    console.log(rows)
    callback(rows)
  }).catch(function (e) {
    console.log(e)
  })
}

var weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

var notifyToUser = function(day, dayName, row) {
  mysql.select(
    'c.phone'
  ).from(
    'bi_user_babies as ub'
  ).join(
    'cSessionInfo as c', 'ub.open_id', 'c.open_id'
  ).where({
    'ub.baby_id': row.baby_id
  }).then(function (rows) {
    console.log(rows)

    for ( i = 0, len = rows.length; i < len; ++i ) {
      var phoneNumber = rows[i].phone
      if (phoneNumber && phoneNumber !== "") {
        var params = [
          row.baby_name,
          dayName,
          day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate(),
          weeks[day.getDay()],
          row.course_name,
          row.begin + "-" + row.end
        ]

        sms.ssendTemplate(config.course_templateId,
          phoneNumber, params,
          function (err, res, resData) {
            if (err) {
              console.log(err)
            }
            else {
              console.log(phoneNumber, params)
            }
          })
      } 
    }
  }).catch(function (e) {
    console.log(e)
  })
}

var notifyCoursesOfDay = function (day, dayName, callback) {
  getCoursesOfDay(day, dayName, 
    function(rows) {
      for ( i = 0, len = rows.length; i < len; ++i ) {
        notifyToUser(day, dayName, rows[i])
      }

      callback(true)
    }
  )
}

var notifyCourse = function () {
  var today = new Date
  var tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  if ( NotifyStatuses.today.day != today.getDay() 
      || !NotifyStatuses.today.status ) {
    NotifyStatuses.today.day = today.getDay()
    NotifyStatuses.today.status = false

    // 每天8点通知
    if (today.getHours() >= 8) {
      notifyCoursesOfDay(today, "今天", 
        function(result) {
          NotifyStatuses.today.status = true
        }
      )
    }
  }

  if ( NotifyStatuses.tomorrow.day != tomorrow.getDay() 
      || !NotifyStatuses.tomorrow.status ) {
    NotifyStatuses.tomorrow.day = tomorrow.getDay()
    NotifyStatuses.tomorrow.status = false

    // 每天19点通知
    if (tomorrow.getHours() >= 17) {
      notifyCoursesOfDay(tomorrow, "明天",
        function(result) {
          NotifyStatuses.tomorrow.status = true
        }
      )
    }
  }
}

var start = function() {
  var rule = new schedule.RecurrenceRule()

  rule.minute = 0
  rule.second = 0
  schedule.scheduleJob(rule, notifyCourse)
}

module.exports = {
  start: start
}
