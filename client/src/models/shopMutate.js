import { createShop, updateShop, deleteShop } from '../services/api';

export default {
  namespace: 'shopMutate',

  state: {
    createResult: '',
    updateResult: '',
    deleteResult: '',
  },

  effects: {
    * create({ payload }, { call, put }) {
      const response = yield call(createShop, payload);
      yield put({
        type: 'saveCreateResult',
        payload: response,
      });
    },
    * update({ payload }, { call, put }) {
      const response = yield call(updateShop, payload);
      yield put({
        type: 'saveUpdateResult',
        payload: response,
      });
    },
    * delete({ payload }, { call, put }) {
      const response = yield call(deleteShop, payload);
      yield put({
        type: 'saveDeleteResult',
        payload: response,
      });
    },
  },

  reducers: {
    saveCreateResult(state, action) {
      return {
        ...state,
        createResult: action.payload,
      };
    },
    saveUpdateResult(state, action) {
      return {
        ...state,
        updateResult: action.payload,
      };
    },
    saveDeleteResult(state, action) {
      return {
        ...state,
        deleteResult: action.payload,
      };
    },
  },
};
