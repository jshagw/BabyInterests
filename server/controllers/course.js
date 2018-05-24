const { mysql } = require('../qcloud')

module.exports = {
  get: async (ctx, next) => {
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
