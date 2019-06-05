import Taro from '@tarojs/taro';

export default {
  namespace: 'common',
  state: {
    openid:   Taro.getStorageSync('openid'),
    user_id:  'ioobot', // Taro.getStorageSync('user_id'), // for debug
    payOrder: Taro.getStorageSync('payOrder'),
  },

  effects: {},

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
