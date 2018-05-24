const { mysql } = require('../qcloud')

module.exports = {
  get: async (ctx, next) => {
    var course_id = ctx.request.query.course_id
    await mysql.select(
      'ti.id as id',
      'ti.name as name',
      'ti.address as address'
    )
    .from('bi_training_institutions_courses as tic')
    .join(
      'bi_training_institutions as ti', 'ti.id', 'tic.institution_id'
    )
    .where({ 'tic.course_id': course_id }).then(function (rows) {
      ctx.state.code = 0
      ctx.state.data = rows
    }).catch(function (e) {
      ctx.state.code = -101
      ctx.state.data = e
      return
    })
  }
}
