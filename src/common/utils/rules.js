
/**
  * 用法：在实例里面
  * this.$rules.phone(13800138000);
  */
let Vue;
export default {
  // 规则组
  rules: {
    // 邮箱
    email(value) {
      const pattern = /^([a-z0-9+_-]+)(\.[a-z0-9+_-]+)*@([a-z0-9-]+\.)+[a-z]{2,6}$/;
      return pattern.test(value) || false;
    },

    // 手机号码
    phone(value) {
      const pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
      return pattern.test(value) || false;
    },

    // 密码
    password(value) {
      const pattern = /^(\S){6,20}$/;
      return pattern.test(value) || false;
    },

    // 身份证
    identity(value) {
      const pattern = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/;
      return pattern.test(value) || false;
    },

    // 银行卡
    bank(value) {
      const pattern = /^(\d{16,19})$/;
      return pattern.test(value) || false;
    },

    // 信用卡
    creditCard(value) {
      const pattern = /^(\d{15,19})$/;
      return pattern.test(value) || false;
    },

    // 验证码
    smsCode(value) {
      const pattern = /^[0-9]{6}$/;
      return pattern.test(value) || false;
    },

    // 金额
    money(value) {
      const pattern = /^(([1-9]{1}\d*.)|((\d){1,2})|([0]{1}\d*.))(\.(\d){1,2})?$/;
      return pattern.test(value) || false;
    },

    // 日期
    date(value) {
      const pattern = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
      return pattern.test(value) || false;
    },

    // 正整数
    integer(value) {
      const pattern = /^\+?[1-9][0-9]*$/;
      return pattern.test(value) || false;
    },

    // 正则图片格式
    images(value) {
      const pattern = /^.*(gif|png|jpe?g)$/;
      return pattern.test(value) || false;
    },
  },
  install(externalVue) {
    if (this.installed) {
      return;
    }

    Vue = externalVue;
    // 绑定规则
    Vue.prototype.$rules = this.rules;

    // 创建validate（form:rules验证方式）
    Vue.prototype.$createValidator = (type, message) => {
      return (rule, value, callback) => {
        const rl = this.rules[type];

        if (!_.isFunction(rl)) {
          return callback(new Error(`no '${type}' rule`));
        }
        if (rl(value)) {
          callback();
        }
        else {
          callback(message);
        }
      };
    };
    this.installed = true;
  },

};
