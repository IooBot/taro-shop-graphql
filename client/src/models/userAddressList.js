import { queryUseraddress, queryOneUseraddress } from '../services/api';

export default {
  namespace: 'userAddressList',

  state: {
    list: [],
    currentUseraddress: {},
  },

  effects: {
    * fetchOne({ payload }, { call, put }) {
      const response = yield call(queryOneUseraddress, payload);
      yield put({
        type: 'queryOne',
        payload: response,
      });
    },
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryUseraddress, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * fetchDefault({ payload }, { call, put }) {
      const response = yield call(queryUseraddress, payload);
      yield put({
        type: 'queryOne',
        payload: Array.isArray(response) ? response[0] : {},
      });
    },
    * appendFetch({ payload }, { call, put }) {
      const response = yield call(queryUseraddress, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryOne(state, action) {
      return {
        ...state,
        currentUseraddress: action.payload,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
