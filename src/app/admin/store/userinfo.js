import http from '@/common/service/http';

export const state = () => {
  return {
    userInfo: {},
  };
};

const mutations = {
  async userInfo(state) {
    const data = await http.Get('Admin.Account').then(res => res);
    state.userInfo = _.assign(state.userInfo, data.data);
  },
};

const actions = {
  userInfo: ({ commit }, options) => commit(options),
};

export default {
  state,
  actions,
  mutations,
};