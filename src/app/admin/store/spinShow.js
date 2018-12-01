
export const state = () => {
  return {
    spinShow  : false,
    loading   : false,
    rowToggle : false,
  };
};

const mutations = {
  spinShow(state, object) {
    state.spinShow = object.spinShow;
  },
  loading(state, object) {
    state.loading = object.loading;
  },
  rowToggle(state) {
    state.rowToggle = !state.rowToggle;
  },
};

const actions = {
  spinShow  : ({ commit }, options) => commit(options),
  loading   : ({ commit }, options) => commit(options),
  rowToggle : ({ commit }, options) => commit(options),
};

export default {
  state,
  actions,
  mutations,
};