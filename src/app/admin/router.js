import Vue    from 'vue';
import Router from 'vue-router';

const Template = '<router-view></router-view>';

// home
const ConfigList    = () => import('./views/config/Config_List.vue');
const ConfigAdd     = () => import('./views/config/Config_Add.vue');
const ConfigEdit    = () => import('./views/config/Config_Edit.vue');
// const OrderList   = () => import('./views/order/List.vue');

// home
const Home        = () => import('./views/home/Index.vue');
const OrderList   = () => import('./views/order/List.vue');

// welcome
const welcomeConf     = () => import('./views/welcome/Conf.vue');
const welcomeLogin    = () => import('./views/welcome/Login.vue');
const welcomeRegister = () => import('./views/welcome/Register.vue');

// Group
const AuthGroupList   = () => import('./views/auth/Group_List.vue');
const AuthGroupAdd    = () => import('./views/auth/Group_Add.vue');
const AuthGroupEdit   = () => import('./views/auth/Group_Edit.vue');
const AuthGroupDetail = () => import('./views/auth/Group_Detail.vue');

// Role
const AuthRoleList   = () => import('./views/auth/Role_List.vue');
const AuthRoleAdd    = () => import('./views/auth/Role_Add.vue');
const AuthRoleEdit   = () => import('./views/auth/Role_Edit.vue');
const AuthRoleDetail = () => import('./views/auth/Role_Detail.vue');

// User
const AuthUserList   = () => import('./views/auth/User_List.vue');
const AuthUserAdd    = () => import('./views/auth/User_Add.vue');
const AuthUserEdit   = () => import('./views/auth/User_Edit.vue');
// const AuthRoleDetail = () => import('./views/auth/Role_Detail.vue');


Vue.use(Router);

export const routes = [
  // config
  {
    path: '/config',
    component: {
      template: Template,
    },
    redirect: 'config/router',
    meta: {
      title: '配置中心',
      // 必须登陆
      authorization: true,
    },
    children: [
      // 路由表配置
      {
        path: 'router',
        name: 'admin.ConfigList',
        component: ConfigList,
        meta: {
          title : '路由表配置',
          type  : 'list',
        },
      },
      {
        path: 'router/add',
        name: 'admin.ConfigAdd',
        component: ConfigAdd,
        meta: {
          title: '新增权限路由',
          menu: false,
          type  : 'add',
        },
      },
      {
        path: 'router/edit/:id',
        name: 'admin.ConfigEdit',
        component: ConfigEdit,
        meta: {
          title: '修改权限路由',
          menu: false,
          type  : 'edit',
        },
      },
    ],
  },
  // home
  {
    path: '/home',
    component: {
      template: Template,
    },
    redirect: '/',
    meta: {
      title: '控制中心',
      // 必须登陆
      authorization: true,
    },
    children: [
      // 菜单管理
      {
        path: '/',
        name: 'admin.Home',
        component: Home,
        meta: {
          title: '菜单管理',
          type : 'list',
        },
      },
      // 首页配置
      {
        path: 'conf',
        name: 'admin.HomeConf',
        component: OrderList,
        meta: {
          title: '首页配置',
          type : 'add',
        },
      },
    ],
  },

  // auth
  {
    path: '/auth',
    component: {
      template: Template,
    },
    redirect: '/auth/group',
    meta: {
      title: '公司管理',
      // 必须登陆
      authorization: true,
    },
    children: [
      // 部门管理
      {
        path: 'group',
        name: 'admin.AuthGroupList',
        component: AuthGroupList,
        meta: {
          title: '部门管理',
          type : 'list',
        },
      },
      // 添加部门
      {
        path: 'group/add',
        name: 'admin.AuthGroupAdd',
        component: AuthGroupAdd,
        meta: {
          title: '添加部门',
          menu: false,
          type : 'add',
        },
      },
      // 修改部门
      {
        path: 'group/edit/:id',
        name: 'admin.AuthGroupEdit',
        component: AuthGroupEdit,
        meta: {
          title: '修改部门',
          menu: false,
          type : 'edit',
        },
      },
      // 部门详情
      {
        path: 'group/:id',
        name: 'admin.AuthGroupDetail',
        component: AuthGroupDetail,
        meta: {
          title: '部门详情',
          menu: false,
          type : 'info',
        },
      },

      // 职位管理
      {
        path: 'role',
        name: 'admin.AuthRoleList',
        component: AuthRoleList,
        meta: {
          title: '职位管理',
          type : 'list',
        },
      },

      // 添加职位
      {
        path: 'role/add',
        name: 'admin.AuthRoleAdd',
        component: AuthRoleAdd,
        meta: {
          title: '添加职位',
          menu: false,
          type : 'add',
        },
      },

      // 修改职位
      {
        path: 'role/edit/:id',
        name: 'admin.AuthRoleEdit',
        component: AuthRoleEdit,
        meta: {
          title: '修改职位',
          menu: false,
          type : 'edit',
        },
      },

      // 职位详情
      {
        path: 'role/:id',
        name: 'admin.AuthRoleDetail',
        component: AuthRoleDetail,
        meta: {
          title: '职位详情',
          menu: false,
          type : 'info',
        },
      },


      // 员工管理
      {
        path: 'user',
        name: 'admin.AuthUserList',
        component: AuthUserList,
        meta: {
          title: '员工管理',
          type : 'list',
        },
      },

      // 添加员工
      {
        path: 'user/add',
        name: 'admin.AuthUserAdd',
        component: AuthUserAdd,
        meta: {
          title: '添加员工',
          menu: false,
          type : 'add',
        },
      },

      // 编辑员工
      {
        path: 'user/edit/:id',
        name: 'admin.AuthUserEdit',
        component: AuthUserEdit,
        meta: {
          title: '编辑员工',
          menu: false,
          type : 'edit',
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
      authorization: true,
    },
    children: [
      // 订单列表
      {
        path: 'list',
        name: 'admin.OrderList',
        component: Home,
        meta: {
          title: '订单列表',
          type : 'list',
        },
      },
      // 添加订单
      {
        path: 'add',
        name: 'admin.OrderAdd',
        component: OrderList,
        meta: {
          title: '添加订单',
          type : 'add',
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
          type : 'add',
        },
      },
      // 登陆页
      {
        path: 'login',
        name: 'admin.WelcomeLogin',
        component: welcomeLogin,
        meta: {
          title: '欢迎登陆',
          type : 'edit',
        },
      },
      // 注册页
      {
        path: 'register',
        name: 'admin.welcomeRegister',
        component: welcomeRegister,
        meta: {
          title: '注册账号',
          type : 'add',
        },
      },
    ],
  },
];

export default new Router({
  mode                 : process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  base                 : process.env.BASE_URL,
  linkExactActiveClass : 'active',
  routes,
});
