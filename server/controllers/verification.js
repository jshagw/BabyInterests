var sms = require("../utils/sms.js")
var { sms: config } = require("../config.js")

var codes = {}

module.exports = {
  get: async (ctx, next) => {
    var query = ctx.request.query
    var phoneNumber = query.phoneNumber

    // 生成验证码
    var code = "";
    for (var i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }

    var params = [code, config.verification_expires]
    sms.ssendTemplate(config.verify_templateId,
      phoneNumber, params,
      function (err, res, resData) {
        if (err) {
          console.log("err: ", err);
          ctx.state.code = -102
          ctx.state.data = err
        }
        else {
          console.log("response data: ", resData);
          // 记录验证码，用于验证
          codes[phoneNumber] = {
            code: code,
            time: Date.now()
          }
        }
      })

    /*params = ["高墨锴","Neil","07-21","星期六","英语","09:00-11:00"]
    sms.ssendTemplate(config.course_templateId,
      phoneNumber, params,
      function (err, res, resData) {
        if (err) {
          console.log("err: ", err);
          ctx.state.code = -102
          ctx.state.data = err
        }
        else {
          console.log("response data: ", resData);

          // 记录验证码，用于验证
          codes[phoneNumber] = {
            code : code,
            time: Date.now()
          }
        }
      })*/
  },

  verify: function(phone, code) {
    var params = codes[phone]
    if ( params && params.code === code ) {
      // 判断时间差
      var delta = Date.now() - params.time
      if (delta >= 0 && delta <= config.verification_expires*60000 ) {
        delete codes[phone]
        return true
      }
    }
    
    return false
  }
}