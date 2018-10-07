import Vue    from 'vue';
import Router from 'vue-router';

const Template = '<router-view></router-view>';

// home
const Home        = () => import('./views/home/Index.vue');
const OrderList   = () => import('./views/order/List.vue');

// welcome
const welcomeConf   = () => import('./views/welcome/Conf.vue');
const welcomeLogin  = () => import('./views/welcome/Login.vue');

Vue.use(Router);

export default new Router({
  mode                 : process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  base                 : process.env.BASE_URL,
  linkExactActiveClass : 'active',
  routes: [
    // home
    {
      path: '/',
      component: {
        template: Template,
      },
      redirect: '/home',
      meta: {
        title: '控制中心',
        // 必须登陆
        // authorization: true,
      },
      children: [
        // 菜单管理
        {
          path: '/home',
          name: 'admin.Home',
          component: Home,
          meta: {
            title: '菜单管理',
          },
        },
        // 首页配置
        {
          path: 'conf',
          name: 'admin.HomeConf',
          component: OrderList,
          meta: {
            title: '首页配置',
          },
        },
      ],
    },

    // order
    {
      path: '/order',
      redirect: '/order/list',
      component: {
        template: Template,
      },
      meta: {
        title: '订单管理',
        // 必须登陆
        // authorization: true,
      },
      children: [
        // 订单列表
        {
          path: 'list',
          name: 'admin.OrderList',
          component: Home,
          meta: {
            title: '订单列表',
          },
        },
        // 添加订单
        {
          path: 'add',
          name: 'admin.OrderAdd',
          component: OrderList,
          meta: {
            title: '添加订单',
          },
        },
      ],
    },

    // welcome
    {
      path: '/welcome',
      redirect: '/welcome/login',
      component: {
        template: Template,
      },
      meta: {
        title: '登陆页',
      },
      children: [
        // 配置数据库
        {
          path: 'conf',
          name: 'admin.WelcomeConf',
          component: welcomeConf,
          meta: {
            title: '配置数据库',
          },
        },
        // 登陆页
        {
          path: 'login',
          name: 'admin.WelcomeLogin',
          component: welcomeLogin,
          meta: {
            title: '欢迎登陆',
          },
        },
      ],
    },
  ],
});
