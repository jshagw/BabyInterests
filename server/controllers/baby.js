const { mysql } = require('../qcloud')

module.exports = {
  get:  async (ctx, next) => {
    ctx.state.code = 0
  },

  post: async (ctx, next) => {
          var params = ctx.req.data 
          ctx.state.code = -1
 /*         await mysql.transaction(function(trx) {
            mysql('bi_babies').insert({
              name: params.baby_name,
              sex: params.baby_sex,
              birthday: params.baby_birthday
            }).returning('id').then(function(id) {
              mysql('bi_user_babies').insert({
                baby_id: id,
                is_creator: '1',
                open_id: "",
                relation: ""
              })
            })
          }).then(function(inserts) {
            ctx.state.code = 0
            ctx.state.data = inserts
          }).catch(function(e) {
            ctx.state.code = -1
            throw new Error(err)
          })*/
  }
}
