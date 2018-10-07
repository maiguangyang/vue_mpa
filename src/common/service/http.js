
import api          from '@/common/utils/api';
import LocalStorage from './localStorage.cookie';

class Http {
  constructor() {
    this.init();
    this.app      = null;
    this.redirect = null;
    this.route    = '';
    this.url      = '';
  }

  init() {
    // axios配置
    const axiosDefaults = {
      baseURL    : process.env.NODE_ENV === 'production' && _.includes(window.location.host, 'test') === false ? 'http://localhost:1874' : 'http://localhost:1874',
      retry      : 2,
      retryDelay : 1000,
      timeout    : 10000,
    };

    axios.defaults = Object.assign(axios.defaults, axiosDefaults);

    // 注入request请求信息
    let request = 0;

    axios.interceptors.request.use(async (config) => {
      // 请求数据的时候出现Loading
      if (_.get(config, 'method') === 'get') {
        request ++;
        this.handleRequest(request);
      }

      const token = await LocalStorage.get('Authorization');
      // if (true === _.get(route, 'meta.authorization') && !_.isEmpty(_.get(token, 'data'))) {
      if (!_.isEmpty(_.get(token, 'data'))) {
        config.headers = Object.assign({}, config.headers, {
          Authorization: `Bearer ${_.get(token, 'data')}`,
        });
      }
      return config;
    }, (err) => {
      return Promise.reject(err);
    });

    // 返回结果拦截
    let isState = false;
    axios.interceptors.response.use(async (response) => {
      if (_.get(response, 'config.method')) {
        request --;
        this.handleRequest(request);
      }

      let data;
      if (response.status === 200) {
        data = await _.get(response, 'data');
      }
      else {

        data = response.data;

        const err = new Error(data.description);

        err.data = data;
        err.response = response;

        throw err;
      }

      // 登录Token失效
      if (data.code * 1 === 401 && isState === false && this.app.$is_wechat === false) {
        LocalStorage.remove('Authorization');
        LocalStorage.remove('userinfo');
        isState = true;

        // this.app.$toast(data.data || 'Authorization 授权已失效');

        let dtLink = {};
        dtLink = {
          name: this.route.name,
        };

        if (!_.isEmpty(this.route.params)) {
          dtLink.params = this.route.params;
        }

        if (!_.isEmpty(this.route.query)) {
          dtLink.query = this.route.query;
        }

        // 跳转到登陆页
        return this.redirect({
          path: `/welcome/login?dt=${JSON.stringify(dtLink)}`,
        });
      }

      else if (data.code * 1 === 1) {
        if (_.isArray(data.data)) {
          _.each(data.data, (item) => {
            if (!_.isEmpty(item.msg)) {
              // this.app.$toast(item.msg);
            }
          });
        }
        else {
          // this.app.$toast(data.data);
        }
      }

      return data;
    }, (err) => {

      request --;
      this.handleRequest(request);
      const errMsg = err.message;

      if (errMsg.indexOf('timeout') !== -1) {
        const { config } = err.config;
        // this.app.$loading.hide();
        // this.app.$toast(errMsg);
        config.__retryCount = config.__retryCount || 0;

        config.__retryCount += 1;

        const backoff = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, config.retryDelay || 1);
        });

        return backoff.then(() => {
          return axios(config);
        });

      }
      else if (errMsg.indexOf('Network') !== -1) {
        // this.app.$loading.hide();
        // this.app.$toast(errMsg);
        return Promise.reject(err);

      }

      return Promise.reject(err);
    });

  }

  handleRequest(data) {
    if (data === 1) {
      // this.app.$toast('请求数据');
      // console.log('service http 请求数据...');
      // this.app.$loading.show('请求数据...');
    }

    if (data <= 0) {
      setTimeout(() => {
        // console.log('service http hide');
        // this.app.$loading.hide();
      }, 500);
    }
  }

  // 通过中间件传过来的值，重置app, redirect, route
  setConfig({ app, redirect, route } = {}) {
    this.app      = app || this.app;
    this.route    = route || this.route;
    this.redirect = redirect || this.redirect;
  }

  // 通过查找common/utils/api文件里面的路由字典
  setUrl(url) {
    return _.get(api, url);
  }

  // 重新返回一个axios方法
  axios(method, apiUrl, data) {
    const url = this.setUrl(apiUrl);
    if (!url) {
      const errMsg = `Error：${apiUrl} api url not defined`;

      this.app.$Dialog.confirm({
        show: true,
        title: '错误提示',
        content: errMsg,
        button: [
          {
            msg: '关闭',
          },
        ],
      });

      return Promise.reject(errMsg);
    }

    return axios({ method, url, data });
  }

  // get请求方式
  Get(url, data) {
    return this.axios('get', url, data);
  }

  // post请求方式
  Post(url, data) {
    return this.axios('post', url, data);
  }

  // put请求方式
  Put(url, data) {
    return this.axios('put', url, data);
  }

  // delete请求方式
  Delete(url, data) {
    return this.axios('delete', url, data);
  }

}

export default new Http();

