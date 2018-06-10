const { mysql } = require('../qcloud')

module.exports = {
  get: async (ctx, next) => {
    var query = ctx.request.query
    var baby_id = query.baby_id
    var day = query.day ? query.day : new Date().getDay()
    // 用raw函数，才能使用mysql的内置函数
    var fields = "bct.id as id, c.name as name \
                  , date_format(bct.begin_time, '%H:%i') as begin \
                  , date_format(bct.end_time, '%H:%i') as end"
    await mysql.select(
      mysql.raw(fields)
    ).from('bi_baby_course_times as bct')
    .join(
      'bi_baby_courses as bc', 'bc.id', 'bct.baby_course_id'
      ).join(
      'bi_courses as c', 'c.id', 'bct.course_id'
      ).where({
        'bct.baby_id': baby_id,
        'bct.day_of_week': day,
        'bc.status' : 1
      }).then(function (rows) {
        ctx.state.code = 0
        ctx.state.data = rows
      }).catch(function (e) {
        ctx.state.code = -101
        ctx.state.data = e
        return
      })
  },

  post: async (ctx, next) => {
    var params = ctx.request.body

    await mysql('bi_baby_courses').select('id')
      .where({
        'baby_id': params.baby_id,
        'course_id': params.course_id,
        'status': 1
      })
      .then(function (rows) {
        if (rows.length > 0) {
          ctx.state.code = -102
          ctx.state.data = "已经有该课程"
          return
        }
        else {
          // 新增
          mysql.transaction(function (trx) {
            mysql('bi_baby_courses').insert({
              baby_id: params.baby_id,
              course_id: params.course_id,
              institution_id: params.institution_id,
              begin_date: params.begin_date,
              end_date: params.end_date
            }).returning('id')
              .transacting(trx)
              .then(function (ids) {
                // 加上return 事务才生效
                var sql = []
                for (var i = 0; i < params.course_times.length; ++i) {
                  var time = params.course_times[i]
                  sql.push({
                    baby_course_id: ids[0],
                    baby_id: params.baby_id,
                    course_id: params.course_id,
                    begin_time: time.begin,
                    end_time: time.end,
                    day_of_week: time.id
                  })
                }
                console.log(sql)
                return mysql('bi_baby_course_times').insert(sql)
                  .transacting(trx)
              })
              .then(trx.commit)
              .catch(trx.rollback)
          })
        }
      }).catch(function (e) {
        ctx.state.code = -101
        ctx.state.data = e
        return
      })
  },

  delete: async (ctx, next) => {
    var params = ctx.request.body

    await mysql('bi_baby_courses').update({
      'status': 99
    })
      .where({
        'id': params.id
      })
      .catch(function (e) {
        ctx.state.code = -101
        ctx.state.data = e
        return
      })
  }
}
