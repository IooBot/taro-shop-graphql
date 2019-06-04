import { queryProduct, queryOneProduct } from '../services/api';

export default {
  namespace: 'productList',

  state: {
    list: [],
    recommandList:[],
    currentProduct: {},
  },

  effects: {
    * fetchOne({ payload }, { call, put }) {
      const response = yield call(queryOneProduct, payload);
      yield put({
        type: 'queryOne',
        payload: response,
      });
    },
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryProduct, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * fetchRecommand({ payload }, { call, put }) {
      const response = yield call(queryProduct, payload);
      yield put({
        type: 'queryRecommandList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * appendFetch({ payload }, { call, put }) {
      const response = yield call(queryProduct, payload);
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
        currentProduct: action.payload,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    queryRecommandList(state, action) {
      return {
        ...state,
        recommandList: action.payload,
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
