// 请求连接前缀
// const baseUrl = 'http://ecommerce.ioobot.cn'
// const baseUrl = 'http://ecenhance.ioobot.cn'
const baseUrl = 'https://ecxcx.ioobot.cn'

// graphql url
// const graphqlEndpoint = 'http://ecommerce.ioobot.cn/graphql'     // enhance server mongodb
// const graphqlEndpoint = 'http://ecenhance.ioobot.cn/graphql'      // fc mongodb
const graphqlEndpoint = baseUrl+'/graphql'      // new schema server mongodb

const storeFile = 'http://deploy.ioobot.cn/api/store-file'

// 输出日志信息
const noConsole = false

//登录
// const authUrl = 'http://localhost:3000/wx/login'
const authUrl = baseUrl + '/wx/login'

//支付
// const payUrl = 'http://localhost:3000/payinfo'
const payUrl = baseUrl + '/payinfo'

export {graphqlEndpoint, storeFile, baseUrl, noConsole, authUrl, payUrl}
