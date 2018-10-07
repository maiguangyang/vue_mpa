import Component from './index.vue';

let $vm;
export default {
  install(Vue) {
    let t = null;
    const toast = (text, opt = { duration: 3500 }) => {
      if (document.querySelector('.toast')) {
        clearTimeout(t);
        document.body.removeChild(document.querySelector('.toast'));
      }

      const ToastPlugin = Vue.extend(Component);

      $vm = new ToastPlugin({
        el: document.createElement('div'),
      });

      if (text) {
        $vm.text = text;
      }

      document.body.appendChild($vm.$el);

      t = setTimeout(() => {
        document.body.removeChild($vm.$el);
      }, opt.duration);
    };

    if (!Vue.$toast) {
      Vue.$toast = toast;
    }

    Vue.mixin({
      created() {
        this.$toast = Vue.$toast;
      },
    });
  },
};