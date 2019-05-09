export function setCookie(name, value, exdays) {
    // expires表示过期时间。如果不设置，默认会话结束即关闭浏览器的时候就消失。
    // 第一步，设置过期时间
    let date = new Date();
    date.setDate(date.getDate() + (exdays * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";expires=" + date;
    // alert(document.cookie);
}

export function getCookie(key) {
    // 第一步：将字符串转化为数组形式,分割字符串时；后需加空格
    let arrStr = document.cookie.split('; ');
    // 第二步：将数组arrStr中的元素再次切割，转换成数组
    let arrStrLength = arrStr.length;

    for (let i = 0; i < arrStrLength; i++) {
        let arr = arrStr[i].split('=');
        if (arr[0] === key) {
            return arr[1];
        }
    }
    return '';
}

export function removeCookie(key) {
    setCookie(key, "任意值", -1);
}
