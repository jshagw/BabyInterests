/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

router.get('/baby', controllers.baby.get)
router.post('/baby', controllers.baby.post)

// 宝宝兴趣班
router.get('/interest', controllers.interest.get)
router.post('/interest', controllers.interest.post)
router.delete('/interest', controllers.interest.delete)

// 系统课程
router.get('/course', controllers.course.get)

// 培训机构
router.get('/institution', controllers.institution.get)

// 某天课程
router.get('/dayCourse', controllers.dayCourse.get)
router.post('/dayCourse', controllers.dayCourse.post)

// 手机号码
router.get('/phone', controllers.phone.get)
router.post('/phone', controllers.phone.post)

// 验证码
router.get('/verification', controllers.verification.get)

// 共享宝宝
router.post('/shareBaby', controllers.shareBaby.post)

module.exports = router
