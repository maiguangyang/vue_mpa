import Vue    from 'vue';
import Router from 'vue-router';

const Home  = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');

Vue.use(Router);

const router = new Router({
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: {
        template: '<router-view></router-view>',
      },
      meta: {
        // 必须登陆
        authorization: false,
      },
      children: [
        // 首页
        {
          path: '/',
          name: 'mobile.Home',
          component: Home,
        },

        // 关于我们
        {
          path: '/about',
          name: 'mobile.About',
          component: About,
        },
      ],
    },
  ],
});

export default router;