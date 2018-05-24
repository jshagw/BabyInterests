const { mysql } = require('../qcloud')

module.exports = {
  get: async (ctx, next) => {
    var baby_id = ctx.request.query.baby_id
    await mysql.select(
      'bc.id as id',
      'ti.name as institution_name',
      'c.name as course_name',
      'bc.begin_date as begin_date',
      'bc.end_date as end_date'
    ).from('bi_baby_courses as bc').join(
      'bi_training_institutions as ti', 'ti.id', 'bc.institution_id'
      ).join(
      'bi_courses as c', 'c.id', 'bc.course_id'
      ).where({ 'bc.baby_id': baby_id }).then(function (rows) {
        ctx.state.code = 0
        ctx.state.data = rows
      }).catch(function (e) {
        ctx.state.code = -1
        throw new Error(e)
      })
  },

  post: async (ctx, next) => {
    var params = ctx.request.body
    var skey = ctx.req.headers["x-wx-skey"]

    ctx.state.code = -1
  },

  delete: async (ctx, next) => {
    var params = ctx.request.body
    var skey = ctx.req.headers["x-wx-skey"]

    ctx.state.code = -1
  }
}
