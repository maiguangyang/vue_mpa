<template>
  <div id="app">
    <div v-if="!isWelcome" class="app-inner">
      <div class="app-head">
        <div class="item-group">
          <router-link v-for="(item, index) in routerArr"
          :key="index"
          class="item"
          :to="item.path">{{ item.meta.title }}</router-link>
        </div>
        <div class="custom-content">
          <div class="expand" @click="handleFullScreen">
            <Tooltip :content="fullscreen ? `退出全屏`:`全屏`" placement="bottom">
              <Icon v-if="!fullscreen" type="md-expand" size="25" color="#fff" />
              <Icon v-else type="md-contract" size="25" color="#fff" />
            </Tooltip>
          </div>
          <div class="user-avator">
            <Dropdown>
              <Avatar icon="ios-person" size="large" />
              <Icon type="md-arrow-dropdown" color="#fff" />
              <DropdownMenu slot="list">
                <DropdownItem disabled>修改密码</DropdownItem>
                <DropdownItem>退出登陆</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div class="app-body">
        <div class="body-left">
          <button type="button" class="navbar-toggle">
            <Icon type="md-menu" size="25" color="#fff" />
          </button>
          <div class="nav-title">{{ childRoute.meta.title }}</div>
          <div class="nav-child">
            <router-link v-for="(item, childKey) in childRoute.children"
              :key="'chkld_' + childKey"
              :to="{ name: item.name }"
              class="child-item">
              <Icon type="ios-list-box-outline" size="20" color="#fff" />
              <span>{{ item.meta.title }}</span>
            </router-link>

          </div>
        </div>
        <div class="body-content">
          <div class="breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem to="/">首页</BreadcrumbItem>
                <BreadcrumbItem :to="childRoute.path">{{ childRoute.meta.title }}</BreadcrumbItem>
                <BreadcrumbItem>{{ $route.meta.title }}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>

    <router-view v-else></router-view>

  </div>
</template>
<script>

export default {
  name: 'app',
  data() {
    return {
      isWelcome    : false,
      fullscreen   : false,

      childRoute   : {
        meta: {},
      },
      routerArr    : [],
    };
  },

  watch: {
    $route(val, old) {
      if (!_.isEmpty(val.name) && val !== old) {

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
  },
  mounted() {

  },

  methods: {
    // 全屏
    handleFullScreen() {
      const element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
        else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
      else if (element.requestFullscreen) {
        element.requestFullscreen();
      }
      else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
      else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      }
      else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
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

  .app-inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .app-head {
      display: flex;
      width: 100%;
      height: 50px;
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

      .custom-content {
        display: flex;
        align-items: center;
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
          padding: 10px 15px;
          background: #fff;
          border-bottom: 1px solid #d2d9e3;

        }

        .home {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

</style>
