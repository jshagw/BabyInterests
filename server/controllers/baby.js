const { mysql } = require('../qcloud')

module.exports = {
  get:  async (ctx, next) => {
    var skey = ctx.req.headers["x-wx-skey"]
    var fields = "b.id as id \
                , b.name as name \
                , b.sex as sex \
                , date_format(b.birthday, '%Y-%m-%d') as birthday \
                , ub.relation as relation \
                , ub.is_creator as is_creator"
    await mysql.select(
        mysql.raw(fields)
      )
      .from('bi_babies as b')
      .join(
        'bi_user_babies as ub', 'b.id', 'ub.baby_id'
      ).join(
        'cSessionInfo as s', 'ub.open_id', 's.open_id'
        ).where({'s.skey' : skey}).then(function(rows) {
            ctx.state.code = 0
            ctx.state.data = rows
          }).catch(function(e) {
            ctx.state.code = -101
            ctx.state.data = e
            return
          })
  },

  post: async (ctx, next) => {
    var params = ctx.request.body
    var skey = ctx.req.headers["x-wx-skey"]

    await mysql('cSessionInfo').select('open_id').where('skey', skey)
      .then(function(result) {
        if (result.length === 0 || !result[0].open_id) {
          ctx.state.code = -102
          ctx.state.data = "未找到用户信息"
          return
        }

        var open_id = result[0].open_id
        if ( params.id ) {
          mysql.transaction(function (trx) {
            mysql('bi_babies').update({
              name: params.name,
              sex: params.sex,
              birthday: params.birthday
            }).where('id', params.id)
              .transacting(trx)
              .then(function (ids) {
                // 加上return 事务才生效
                return mysql('bi_user_babies').update({
                  relation: params.relation
                }).where({
                  baby_id: params.id,
                  open_id: open_id
                }).transacting(trx)
              })
              .then(trx.commit)
              .catch(trx.rollback)
          })
        }
        else {
          mysql.transaction(function (trx) {
            mysql('bi_babies').insert({
              name: params.name,
              sex: params.sex,
              birthday: params.birthday
            })
              .returning('id')
              .transacting(trx)
              .then(function (ids) {
                // 加上return 事务才生效
                return mysql('bi_user_babies').insert({
                  baby_id: ids[0],
                  is_creator: '1',
                  open_id: open_id,
                  relation: params.relation
                })
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
  }
}
