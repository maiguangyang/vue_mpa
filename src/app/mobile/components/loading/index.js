import Component from './index.vue';

let $vm;
export default {
  install(Vue) {
    if (!$vm) {
      const LoadingPlugin = Vue.extend(Component);

      $vm = new LoadingPlugin({
        el: document.createElement('div'),
      });

      document.body.appendChild($vm.$el);
    }

    $vm.show = false;

    const loading = {
      show(text) {
        $vm.show = true;
        if (text) {
          $vm.text = text;
        }
      },
      hide() {
        $vm.show = false;
      },
    };

    if (!Vue.$loading) {
      Vue.$loading = loading;
    }

    Vue.mixin({
      created() {
        this.$loading = Vue.$loading;
      },
    });
  },
};