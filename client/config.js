/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://a2bgi14b.qcloud.la';
// 生产环境
//var host = 'https://910088659.babyinterests.xyz';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        babyUrl: `${host}/weapp/baby`,
        interestUrl: `${host}/weapp/interest`,
        courseUrl: `${host}/weapp/course`,
        institutionUrl: `${host}/weapp/institution`,
        dayCourseUrl: `${host}/weapp/dayCourse`
    }
};

module.exports = config;
