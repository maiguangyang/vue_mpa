import LocalStorage from '@/common/service/localStorage.cookie';

export default async ({ app, redirect, route }) => {

  // 存在Token的话，跳转到首页
  const token = await LocalStorage.get('Authorization');
  if (_.isEmpty(route.name)) {
    return redirect({
      path: '/home',
    });
  }

  if (!_.isEmpty(_.get(token, 'data')) && route.path === '/welcome/login') {
    return redirect({
      path: '/home',
    });
  }

  const parent = _.filter(route.matched, { name: route.name });
  // 父级路由不为空
  if (!_.isEmpty(parent)) {
    // 判断路由是否需要登陆
    if (_.get(parent[0].parent, 'meta.authorization') === true) {

      let dtLink = {};
      dtLink = {
        name: route.name,
      };

      if (!_.isEmpty(route.params)) {
        dtLink.params = route.params;
      }

      if (!_.isEmpty(route.query)) {
        dtLink.query = route.query;
      }

      // 如果Token为空且不是到登录页，则重定向到登录页
      if (_.isEmpty(_.get(token, 'data')) && route.path !== '/welcome/login' && app.$is_wechat === false) {
        return redirect({
          path: `/welcome/login?dt=${JSON.stringify(dtLink)}`,
        });
      }
    }
  }

};