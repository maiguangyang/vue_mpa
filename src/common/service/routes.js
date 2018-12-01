import http         from '@/common/service/http';
import LocalStorage from '@/common/service/localStorage.cookie';


class Routes {
  lock = false
  get() {
    // 获取前端路由
    // const routes = LocalStorage.get('userAtuhRoutes');
    // if (!_.isEmpty(routes.data)) {
    //   return routes.data;
    // }

    const repExp = [
      { type: 'List', name: '管理' },
      { type: 'Add', name: '添加' },
      { type: 'Edit', name: '修改' },
      { type: 'Detail', name: '详情' },
      { type: 'Del', name: '删除' },
    ];

    const repJSON = {
      list : 'List',
      add  : 'Add',
      edit : 'Edit',
      info : 'Detail',
      del  : 'Del',
    };

    http.Get('Admin.Routes')
    .then((res) => {
      if (res.code === 0) {
        const data   = res.data;
        const routesA = ['/home', 'user.Home', 'admin.Home'];
        // let lastRouteName = null;
        _.each(data, (item) => {
          if (!_.isEmpty(item.routes)) {
            try {
              item.routes = JSON.parse(item.routes);
            } catch (err) {
              item.routes = [];
            }
          }

          if (!_.isEmpty(item.sub_routes)) {
            try {
              item.sub_routes = JSON.parse(item.sub_routes);
            } catch (err) {
              item.sub_routes = [];
            }
          }

          if (!_.isEmpty(item.content)) {
            try {
              item.content = JSON.parse(item.content);
            } catch (err) {
              item.content = [];
            }
          }

          const objItemA = _.find(item.content, { id: item.sid * 1 });
          if (!_.isEmpty(objItemA) && !_.isEmpty(item.routes)) {

            _.each(objItemA.type, (child, key) => {
              const exp = _.find(repExp, { type: repJSON[key] }) || {};
              if (!_.isEmpty(exp)) {
                _.each(repExp, (r) => {
                  // const title = item.routes[0].title.replace(r.name, exp.name);
                  const name  = item.routes[0].name.replace(r.type, exp.type);
                  if (_.includes(item.routes[0].name, r.type)) {
                    if (item.routes[0].path) {
                      const path  = item.routes[0].path.replace('#', '');
                      if (_.indexOf(routesA, path) === -1) {
                        routesA.push(path);
                      }
                    }
                    if (_.indexOf(routesA, name) === -1) {
                      routesA.push(name);
                    }
                  }
                });
              }
            });
          }

          const objItemB = _.find(item.content, { id: item.bid * 1 });
          if (!_.isEmpty(objItemB) && !_.isEmpty(item.sub_routes)) {
            _.each(objItemB.type, (child, key) => {
              const exp = _.find(repExp, { type: repJSON[key] }) || {};
              if (!_.isEmpty(exp)) {
                _.each(repExp, (r) => {
                  // const title = item.sub_routes[0].title.replace(r.name, exp.name);
                  const name  = item.sub_routes[0].name.replace(r.type, exp.type);
                  if (_.includes(item.sub_routes[0].name, r.type)) {
                    if (item.sub_routes[0].path) {
                      const path  = item.sub_routes[0].path.replace('#', '');
                      if (_.indexOf(routesA, path) === -1) {
                        routesA.push(path);
                      }
                    }
                    if (_.indexOf(routesA, name) === -1) {
                      routesA.push(name);
                    }
                  }
                });
              }
            });
          }

        });

        LocalStorage.set('userAtuhRoutes', routesA, 60 * 60 * 23);
      }
    });

  }

  Check(name) {

    const routes = LocalStorage.get('userAtuhRoutes') || {};
    // if (_.isEmpty(routes)) {
    //   this.get();
    //   setTimeout(() => {
        // window.location.reload();
    //   }, 500);
    // }

    // 查找是否是超级账户
    const auth = LocalStorage.get('Authorization');
    let obj = {};
    if (!_.isEmpty(auth.data)) {
      const arr = auth.data.split('.');
      try {
        obj = JSON.parse(window.atob(arr[1]));
      }
      catch (err) {
        obj = {};
      }

      obj = obj.content;
    }

    if (obj.super === 2) {
      return true;
    } else if (this.lock !== true) {
      this.lock = true;
      this.get();
    }
    // 返回前端路由权限
    const has = _.indexOf(routes.data, name) !== -1 ? true : false;
    return has;
  }

}

export default new Routes();