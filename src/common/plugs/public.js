/**
 * Validator表单验证插件
 * Version Beta 0.0.1
 */

/* eslint-disable */
import vue  from 'vue';
import MD5  from 'crypto-js/md5';
import Routes from '@/common/service/routes';

let Vue;

class Public {
  constructor () {
  }

  formFilter (filters = {}, formFilterMethod = {}) {
    let filterArr = [];
    if (!_.isEmpty(filters) && !_.isEmpty(formFilterMethod)) {
      _.forEach(filters, (value, key) => {
        if (!_.isEmpty(value + '')) {
          filterArr.push([
            key,
            this.formFilterMethod[key] || '=',
            value,
          ]);
        }
      });
    }

    return filterArr;
  }

  install (externalVue) {
    if (this.installed) {
      return;
    }

    Vue = externalVue;
    // 验证方法
    Vue.prototype.$formFilter = this.formFilter;
    Vue.prototype.$spinShow   = true;
    Vue.prototype.$routes  = Routes;

    this.installed = true;
  }
}

export default new Public();

/* eslint-enable */