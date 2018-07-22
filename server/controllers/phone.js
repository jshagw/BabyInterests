const { mysql } = require('../qcloud')
var verification = require('./verification.js')

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
  },

  post: async (ctx, next) => {
    var skey = ctx.req.headers["x-wx-skey"]
    var params = ctx.request.body

    if ( !verification.verify(params.phone, params.code) ) {
      ctx.state.code = -103
      ctx.state.data = "手机号码或验证码输入错误"
      return
    }

    await mysql('cSessionInfo').update({
      phone: params.phone
    })
      .where({ 'skey': skey })
      .then(res => {
        ctx.state.code = 0
      }).catch(err => {
        ctx.state.code = -101
        ctx.state.data = err
        return
      })
  }
}
