/**
 * Validator表单验证插件
 * Version Beta 0.0.1
 */

/* eslint-disable */
import vue      from 'vue';
import MD5  from 'crypto-js/md5';

let Vue;

class IsWechat {
  constructor () {
  }

  is_weixn () {
    let ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    }
    return false;
  }

  install (externalVue) {
    if (this.installed) {
      return;
    }

    Vue = externalVue;
    // 验证方法
    Vue.prototype.$is_wechat = this.is_weixn();
    Vue.prototype.$Bus     = new vue();
    Vue.prototype.$md5     = MD5;

    this.installed = true;
  }
}

export default new IsWechat();

/* eslint-enable */