<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  computed: {

  },
  mounted() {
    const originWidthByDesign = 750 / 2;
    const originRootFontSize = 16;
    const maxLimitWidth = 667;

    const doc = document.documentElement;

    /**
     * 随便创建一个 div 并赋予 1rem 的字体大小
     * 如果不支持 rem, 它的值不会等于 1rem的
     * 因此可以简单检测出当前浏览器是否支持 rem
     */
    const div = document.createElement('div');
    div.setAttribute('style', 'font-size: 1rem');

    function reCalculate() {
      let clientWidth = doc.clientWidth;
      if (!clientWidth) {
        return;
      }

      clientWidth = clientWidth < maxLimitWidth ? clientWidth : maxLimitWidth;
      doc.style.fontSize = `${(originRootFontSize * clientWidth) / originWidthByDesign}px`;
      doc.style.display = 'none';

      doc.style.display = '';
    }

    if (!!document.addEventListener && div.style.fontSize === '1rem') {


      /**
       * 重置大小与ready的时候触发
       * 一下跟蒜素大小计算
       */
      window.addEventListener('resize', reCalculate, false);
      document.addEventListener('DOMContentLoaded', reCalculate, false);

      reCalculate();
    }
  },
  beforeDestroy() {
    // window.removeEventListener('sw.update', this.handleUpdate);
  },
  methods: {
    // 站点发生更新变化
    handleUpdate() {
      // window.location.reload();
    },
  },
};

</script>

<style lang="scss">
  @import './assets/stylus/public';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
