
import http from '@/common/service/http';

export default ({ redirect, route }) => {
  setTimeout(() => {

    // 检测是否配置了数据库
    http.Get('Conf.checkDataBase')
      .then((res) => {
        if (res.code === 200) {
          const data = res.data;

          if (data.has === true && route.name === 'admin.WelcomeConf') {
            return redirect({
              path: '/home',
            });
          }
          else if (data.has !== true) {
            if (_.includes(route.name, 'admin')) {
              return redirect({
                path: '/welcome/conf',
              });
            }
            window.location.href = '/admin/';
          }
        }
      });
  }, 100);
};