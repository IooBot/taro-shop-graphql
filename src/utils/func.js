const idGen = (kind) => {
    return kind + '_' + Date.now() + '_' + Math.random().toString().slice(-8);
};

const getIsWechatBrowser = function(){
    let ua = navigator.userAgent.toLowerCase();
    let isWechat = /micromessenger/i.test(ua) || typeof navigator.wxuserAgent !== 'undefined';
    // console.log('isWechat result',isWechat);
    let isWechatBrowser =  isWechat ? true:false;
    // console.log('isWechatBrowser',isWechatBrowser);
    return isWechatBrowser;
};

export {idGen, getIsWechatBrowser}