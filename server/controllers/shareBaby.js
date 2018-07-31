const { mysql } = require('../qcloud')

module.exports = {
    post: async (ctx, next) => {
    var params = ctx.request.body
    var skey = params.id
    var baby_id = params.baby

    await mysql('cSessionInfo').select('open_id').where('skey', skey)
      .then(function (result) {
        if (result.length === 0 || !result[0].open_id) {
          ctx.state.code = -102
          ctx.state.data = "未找到用户信息"
          return
        }

        var open_id = result[0].open_id
        mysql('bi_user_babies').insert({
          open_id: open_id,
          baby_id: baby_id,
          relation: 0
        }).then(function(res) {
          console.log(res)
        }).catch(function(e) {
          console.log(e)
        })
      }).catch(function (e) {
        ctx.state.code = -101
        ctx.state.data = e
        return
      })
  }
}
