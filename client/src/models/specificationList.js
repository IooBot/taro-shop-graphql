import { querySpecification, queryOneSpecification } from '../services/api';

export default {
  namespace: 'specificationList',

  state: {
    list: [],
    currentSpecification: {},
  },

  effects: {
    * fetchOne({ payload }, { call, put }) {
      const response = yield call(queryOneSpecification, payload);
      yield put({
        type: 'queryOne',
        payload: response,
      });
    },
    * fetch({ payload }, { call, put }) {
      const response = yield call(querySpecification, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * appendFetch({ payload }, { call, put }) {
      const response = yield call(querySpecification, payload);
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
        currentSpecification: action.payload,
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
