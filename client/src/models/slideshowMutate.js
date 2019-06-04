import { createSlideshow, updateSlideshow, deleteSlideshow } from '../services/api';

export default {
  namespace: 'slideshowMutate',

  state: {
    createResult: '',
    updateResult: '',
    deleteResult: '',
  },

  effects: {
    * create({ payload }, { call, put }) {
      const response = yield call(createSlideshow, payload);
      yield put({
        type: 'saveCreateResult',
        payload: response,
      });
    },
    * update({ payload }, { call, put }) {
      const response = yield call(updateSlideshow, payload);
      yield put({
        type: 'saveUpdateResult',
        payload: response,
      });
    },
    * delete({ payload }, { call, put }) {
      const response = yield call(deleteSlideshow, payload);
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
