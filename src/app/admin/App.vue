<template>
  <div id="app">
    <div v-if="!isWelcome" class="app-inner">
      <Row class="app-head">
        <Col :xs="0" :sm="20" :md="21" :lg="22" class="nav-link" :class="{ active: xsState }">
          <Col class="item-group">
            <router-link v-for="(item, index) in routerArr"
            :key="index"
            v-if="$routes.Check(item.path)"
            class="item"
            :to="item.path">{{ item.meta.title }}</router-link>
          </Col>
        </Col>
        <button type="button" class="xs-toggle" @click="handleXsShow()">
          <Icon type="md-menu" size="25" color="#fff" />
        </button>
        <Col :xs="0" :sm="4" :md="3" :lg="2" class="custom-content">
          <div :xs="0" :sm="6" :md="6" :lg="6" class="expand" @click="handleFullScreen">
            <Tooltip :content="fullscreen ? `退出全屏`:`全屏`" placement="bottom">
              <Icon v-if="!fullscreen" type="md-expand" size="25" color="#fff" />
              <Icon v-else type="md-contract" size="25" color="#fff" />
            </Tooltip>
          </div>
          <div class="user-avator" @click="handleDropdown()">
            <Dropdown>
              <Avatar icon="ios-person" size="large" />
              <Icon type="md-arrow-dropdown" color="#fff" />
              <DropdownMenu slot="list">
                <DropdownItem>操作日志</DropdownItem>
                <DropdownItem disabled>修改密码</DropdownItem>
                <DropdownItem>
                  <span @click="handleLoginOut()" >退出登陆</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Col>
      </Row>

      <Row class="app-body">
        <Col :xs="0" :sm="16" :md="12" :lg="8" class="body-left" :class="{ active: leftState }">
          <button type="button" class="navbar-toggle">
            <Icon type="md-menu" size="25" color="#fff" />
          </button>
          <div class="nav-title">{{ childRoute.meta.title }}</div>
          <div class="nav-child">
            <router-link v-for="(item, childKey) in childRoute.children"
              :key="'chkld_' + childKey"
              v-if="item.meta.menu !== false && $routes.Check(item.name)"
              :to="{ name: item.name }"
              class="child-item">
              <Icon type="ios-list-box-outline" size="20" color="#fff" />
              <span>{{ item.meta.title }}</span>
            </router-link>

          </div>
        </Col>
        <Col :xs="24" :sm="16" :md="12" :lg="8" class="body-content">
          <div class="breadcrumb">
            <Breadcrumb>
              <BreadcrumbItem to="/">首页</BreadcrumbItem>
              <BreadcrumbItem :to="childRoute.path">{{ childRoute.meta.title }}</BreadcrumbItem>
              <BreadcrumbItem>{{ $route.meta.title }}</BreadcrumbItem>
            </Breadcrumb>

            <button type="button" class="breadcrumb-xs-toggle" @click="handleBreadcrumbShow()">
              <Icon type="md-menu" size="25" color="#999" />
            </button>
          </div>
          <div class="content">
            <Spin size="large" fix v-show="spinShow"></Spin>

            <!-- <Card v-if="!userAuth" style="width: 80%; margin: 20px auto 0 auto;">
              <div style="text-align:center; color: #ff9900">
                <h2>账户权限受限，无法继续操作！</h2>
              </div>
            </Card> -->
            <router-view v-show="!spinShow"></router-view>
          </div>
        </Col>
      </Row>
    </div>

    <router-view v-else></router-view>

  </div>
</template>
<script>

import LocalStorage from '@/common/service/localStorage.cookie';

export default {
  name: 'app',
  data() {
    return {
      isWelcome  : false,
      fullscreen : false,
      xsState    : false,
      leftState  : false,

      childRoute   : {
        meta: {},
      },
      routerArr : [],
      timer     : null,
      userAuth  : true,
    };
  },

  watch: {
    $route(val, old) {

      if (!_.isEmpty(val.name) && val !== old) {
        this.xsState   = false;
        this.leftState = false;

        // 停止计时器
        if (this.timer) {
          clearTimeout(this.timer);
        }

        // 提取路由组，排除登陆模块
        this.routerArr = _.filter(_.get(this.$router, 'options.routes'), (item) => {
          return !_.includes(item.path, 'welcome');
        });

        // 提取当前子路由
        let current = [];
        _.map(this.routerArr, (item) => {
          current = _.filter(item.children, { name: val.name });
          if (!_.isEmpty(current)) {
            this.childRoute = item;
          }
        });

        // 判断是否需要登陆，显示不同router-view
        this.isWelcome = _.includes(val.path, 'welcome');
      }
    },

  },
  computed: {
    spinShow() {
      return _.get(this.$store.state, 'spinShow.spinShow') || false;
    },
  },
  mounted() {
    // 事件总线监听
    this.$Bus.$on('timer', (msg) => {
      if (msg) {
        this.timer = msg;
      }
    });

    this.$Bus.$on('auth', (data) => {
      this.userAuth = data;
    });

  },
  methods: {
    // 退出登陆
    handleLoginOut() {
      this.$Modal.confirm({
        title    : '温馨提示',
        content  : '<p>是否要退出登陆？</p>',
        loading  : true,
        closable : true,
        onOk     : () => {
          setTimeout(() => {
            LocalStorage.remove('Authorization');
            LocalStorage.remove('userAtuhRoutes');
            this.$Message.success('退出成功');
            this.$Modal.remove();
            this.$router.push({
              name: 'admin.WelcomeLogin',
            });
          }, 500);
        },
      });
    },

    // 小屏头像按钮
    handleDropdown() {
      this.xsState   = false;
      this.leftState = false;
    },

    // 小屏显示
    handleXsShow() {
      this.xsState   = !this.xsState;
      this.leftState = false;
    },

    // 小屏子菜单
    handleBreadcrumbShow() {
      this.leftState = !this.leftState;
      this.xsState   = false;
    },

    // 全屏
    handleFullScreen() {
      const element = document.documentElement;

      // 全屏
     const requestMethod = element.requestFullScreen
      || element.webkitRequestFullScreen
      || element.mozRequestFullScreen
      || element.msRequestFullScreen;

      // 退出全屏
     const exitMethod = document.exitFullscreen
      || document.mozCancelFullScreen
      || document.webkitExitFullscreen
      || document.webkitExitFullscreen;

      if (!this.fullscreen) {
        requestMethod.call(element);
      }
      else {
        exitMethod.call(document);
      }

      this.fullscreen = !this.fullscreen;

    },
  },
};
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
    outline: 0 !important;
    -webkit-tap-highlight-color:rgba(255,0,0,0);
  }

  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    font-family: "PingFangSC-Regular, sans-serif, Microsoft YaHei";
    overflow: hidden;
  }

  body {
    color: #666;
  }

  #app {
    width: 100%;
    height: 100%;
    background: #eaedf1;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-active {
        color: #42b983;
      }
    }
  }

  .filter-group {
    padding: 20px;

    .filter-item {
      margin-bottom: 20px;
    }

    .row-toggle {
      display: none;
      border: none;
      background: none;
    }
  }

  // 表格
  .ivu-table-wrapper {
    border-top: 0;

    .ivu-table {
      &:before, &:after {
        background: none;
      }
    }

    .ivu-table-header table, .ivu-table-fixed-header table {
      border-top: 1px solid #dcdee2;
    }
  }

  .app-inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .app-head {
      display: flex;
      width: 100%;
      height: 50px;
      justify-content: flex-end;
      background: #488dc9;

      .item-group {
        display: flex;
        flex: 1 0 0;
        width: 100%;
        height: 100%;

        .item {
          display: flex;
          padding: 0 40px;
          color: #fff;
          align-items: center;
          border-right: 1px solid #2c6da5;

          &:last-child {
            border-right: none;
          }

          &:hover, &.router-link-active {
            background: #2c6da5;
          }
        }

      }

      .xs-toggle {
        display: none;
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        border: none;
        background: none;
      }

      .custom-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;

        > div {
          margin-right: 10px;
        }

        .user-avator {
          display: flex;
          height: 100%;
          align-items: center;
          cursor: pointer;
        }
      }

    }

    .app-body {
      display: flex;
      height: 100%;

      .body-left {
        width: 200px;
        height: 100%;
        background: #2f4050;

        .nav-title {
          padding-left: 20px;
          height: 45px;
          line-height: 45px;
          color: #fff;
          border-bottom: 1px solid #28364a;
          background: #488dc9;
        }

        .nav-child {
          .router-link-active {
            color: #fff;
            background: #151f2f;
          }
        }

        .navbar-toggle {
          z-index: 1000;
          width: 100%;
          height: 35px;
          border: none;
          background: none;
          cursor: pointer;
        }

        .child-item {
          display: flex;
          padding-left: 20px;
          width: 100%;
          height: 45px;
          line-height: 45px;
          align-items: center;
          color: #a7b1c2;
          background: #242f3f;

          &.active, &:hover {
            color: #fff;
            background: #151f2f;
          }

          > span {
            padding-left: 5px;
          }
        }
      }

      .body-content {
        display: flex;
        flex-direction: column;
        flex: 1 0 0;

        .breadcrumb {
          display: flex;
          padding: 10px 15px;
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #d2d9e3;

          .ivu-breadcrumb {
            flex: 1 0 0;
          }

          .breadcrumb-xs-toggle {
            display: none;
            background: none;
            border: none;
          }
        }

        .content {
          display: flex;
          flex-direction: column;
          margin: 15px;
          padding-bottom: 20px;
          flex: 1 0 0;
          overflow: hidden;
          overflow-y: auto;
          border: 1px solid #d2d9e3;
          background: #fff;

          .table {
            position: relative;
          }

          .tabs {
            margin: 19px;
            padding: 1px;
            overflow: inherit;

            > :first-child {
              margin-bottom: 0;
            }

            > :last-child {
              > div {
                border: 1px solid #ddd;
                border-top: none;

                &:last-child {
                  border-left: none;
                }

                &:first-child {
                  border-left: 1px solid #ddd;

                }
              }
            }

          }

          .table-tag {
            position: absolute;
            display: inline-block;
            right: 20px;
          }
        }

        .home {
          width: 100%;
          height: 100%;
        }
      }
    }
  }


  @media (max-width: 1414px) {
    .ivu-table-wrapper {
      border-right: none;
      // border-right: 1px solid #dcdee2;

      // .ivu-table-border td:last-child, .ivu-table-border th:last-child {
      //   border-right: 0;
      // }
    }
  }

  @media (max-width: 768px) {
    .ivu-col-span-xs-0 {
      display: inherit;
    }

    .filter-group {
      position: relative;
      padding-bottom: 0;
      height: 123px;
      overflow: hidden;

      &.active {
        height: auto;
      }

      .row-toggle {
        position: absolute;
        display: block;
        bottom: -9px;
        left: 50%;
        transform: translate(-50%, 0);
        border: none;
        background: none;
      }
    }

    .nav-link {
      position: absolute;
      top: 47px;
      width: 100%;
      z-index: -1;
      opacity: 0;
      border-top: 1px solid #2c6da5;
      background: #488dc9;
      transition: all .5s;

      &.active {
        opacity: 1;
        z-index: 2000;
      }
    }

    .app-inner .app-head {
      .xs-toggle {
        display: block;
      }

      .item-group {
        flex-direction: column;

        .item {
          height: 50px;
        }
      }

      .custom-content {
        .expand {
          display: none;
        }
      }
    }

    .app-inner .app-body .body-left {
      position: absolute;
      display: block;
      width: 80%;
      left: -1000px;
      z-index: 1000;
      // opacity: 0;
      border-top: 1px solid #2c6da5;
      transition: all .5s;

      &.active {
        left: 0;
        // opacity: 1;
      }

      .navbar-toggle {
        display: none;
      }
    }

    .app-inner .app-body .body-content .breadcrumb .breadcrumb-xs-toggle {
      display: block;
    }
  }

</style>
