const { mysql } = require('../qcloud')

module.exports = {
  get: async (ctx, next) => {
    var baby_id = ctx.request.query.baby_id
    // 用raw函数，才能使用mysql的内置函数
    var fields = "bc.id as id, ti.name as institution_name, c.name as course_name \
                  , date_format(bc.begin_date, '%Y-%m-%d') as begin_date \
                  , date_format(bc.end_date, '%Y-%m-%d') as end_date"
    await mysql.select(
      mysql.raw(fields)
    ).from('bi_baby_courses as bc').join(
      'bi_training_institutions as ti', 'ti.id', 'bc.institution_id'
      ).join(
      'bi_courses as c', 'c.id', 'bc.course_id'
      ).where({ 'bc.baby_id': baby_id }).then(function (rows) {
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
        'course_id': params.course_id
      })
      .then(function (rows) {
        if (rows.length > 0 ) {
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
            })
              .transacting(trx)
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
    var skey = ctx.req.headers["x-wx-skey"]

    ctx.state.code = -101
  },

  getAllCourses: async (ctx, next) => {
    await mysql.select(
      'c.id as id',
      'c.name as name'
    ).from('bi_courses as c')
    .then(function (rows) {
        ctx.state.code = 0
        ctx.state.data = rows
      }).catch(function (e) {
        ctx.state.code = -101
        ctx.state.data = e
        return
      })
  }
}
