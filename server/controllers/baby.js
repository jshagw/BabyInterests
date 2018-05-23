const { mysql } = require('../qcloud')

module.exports = {
  get:  async (ctx, next) => {
    var skey = ctx.req.headers["x-wx-skey"]
    /*var sql = "select b.id, b.name, b.sex, b.birthday, ub.relation, ub.is_creator \
              from bi_babies b, bi_user_babies ub, cSessionInfo s \
              where s.skey = ? and s.open_id = ub.open_id and ub.baby_id = b.id"
    await mysql.raw(sql, skey).then(function (rows) {
        ctx.state.code = 0
        ctx.state.data = rows[0]
      }).catch(function (e) {
        ctx.state.code = -1
        throw new Error(e)
      })*/
    await mysql.select(
        'bi_babies.id as id',
        'bi_babies.name as name',
        'bi_babies.sex as sex',
        'bi_babies.birthday as birthday',
        'bi_user_babies.relation as relation',
        'bi_user_babies.is_creator as is_creator'
      ).from('bi_babies').join(
        'bi_user_babies', 'bi_babies.id', 'bi_user_babies.baby_id'
      ).join(
        'cSessionInfo', 'bi_user_babies.open_id', 'cSessionInfo.open_id'
        ).where({'cSessionInfo.skey' : skey}).then(function(rows) {
            ctx.state.code = 0
            ctx.state.data = rows
          }).catch(function(e) {
            ctx.state.code = -1
            throw new Error(e)
          })
  },

  post: async (ctx, next) => {
    var params = ctx.request.body
    var skey = ctx.req.headers["x-wx-skey"]

    await mysql('cSessionInfo').select('open_id').where('skey', skey)
      .then(function(result) {
        var open_id = result[0].open_id
        if (!open_id) {
          ctx.state.code = -1
          throw new Error("not found user")
        }

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
        ctx.state.code = -1
        throw new Error(e)
      })
  }
}
