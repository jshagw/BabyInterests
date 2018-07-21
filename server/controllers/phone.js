const { mysql } = require('../qcloud')

module.exports = {
  get: async (ctx, next) => {
    var skey = ctx.req.headers["x-wx-skey"]

    await mysql('cSessionInfo').select('phone')
      .where({ 'skey': skey })
      .then(res => {
        ctx.state.code = 0
        ctx.state.data = res
      }).catch(err => {
        ctx.state.code = -101
        ctx.state.data = err
        return
      })
  }
}
