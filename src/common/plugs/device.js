/**
 * Validator表单验证插件
 * Version Beta 0.0.1
 */

/* eslint-disable */
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

    this.installed = true;
  }
}

export default new IsWechat();

/* eslint-enable */