// 请求连接前缀
const baseUrl = 'http://ecommerce.ioobot.cn';
// const baseUrl = 'http://ecxcx.ioobot.cn';
// const baseUrl = 'http://ecenhance.ioobot.cn';
// const graphqlFC = 'https://ec.ioobot.cn/graphql';            // old schema fc mongodb
// const graphqlFC = 'http://ecenhance.ioobot.cn/graphql';      // new schema fc mongodb
const graphqlEndpoint = baseUrl+'/graphql';      // new schema server mongodb
const storeFile = 'http://deploy.ioobot.cn/api/store-file';
// 输出日志信息
const noConsole = false;

//登录
const authUrl = 'http://ecxcx.ioobot.cn/wx/login'
// const authUrl = 'http://localhost:3000/wx/login'
//支付
// const payUrl = 'http://ecenhance.ioobot.cn/payinfo'
const payUrl = 'http://localhost:3000/payinfo'

export {graphqlEndpoint, storeFile, baseUrl, noConsole, authUrl, payUrl}
