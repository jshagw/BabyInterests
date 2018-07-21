var sms = require("../utils/sms.js")
var { sms: config } = require("../config.js")

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

    params = ["高墨锴","Neil","07-21","星期六","英语","09:00-11:00"]
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
        }
      })

    /*sms.ssendTemplate(config.verify_templateId, 
              phoneNumber, params, 
              function (err, res, resData){
                if (err) {
                  console.log("err: ", err);
                  ctx.state.code = -102
                  ctx.state.data = err
                }
                else {
                  console.log("response data: ", resData);
                }
              })*/
  }
}