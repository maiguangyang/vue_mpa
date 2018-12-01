
export default {
  Home: {
    weather : 'weather',
    bank    : 'bank',
  },
  User: {
    weather: 'weather',
  },

  // 管理后台
  Admin: {
    Account : 'admin/detail',
    Routes  : 'admin/routes',
    // 路由权限配置
    Config: {
      Table  : 'admin/auth/table',
      Seting : 'admin/auth/seting',
      Auth   : 'admin/roleAuth',
    },
    // 权限
    Auth: {
      Group : 'admin/group',
      Role  : 'admin/role',
      User  : 'admin/user',
    },
  },

  // 系统配置
  Conf: {
    // 检测是否设置数据库
    checkDataBase : '/sys/check/database',
    sqlopen       : '/sys/test/sqlopen',
  },

  // 欢迎页
  Welcome: {
    Login: '/admin/login',
  },
};