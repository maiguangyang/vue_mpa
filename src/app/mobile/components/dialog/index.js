
import Component  from './index.vue';

let $vm;
export default {
  install(Vue) {
    if (!$vm) {
      const DialogPlugin = Vue.extend(Component);

      $vm = new DialogPlugin({
        el: document.createElement('div'),
      });

      document.body.appendChild($vm.$el);
    }

    $vm.show = false;

    const Dialog = {
      confirm(data) {
        if (data) {
          $vm.formTemp = _.assign({}, $vm.formTemp, data);
        }
      },
      hide() {
        $vm.formTemp.show = false;
      },
    };

    if (!Vue.$Dialog) {
      Vue.$Dialog = Dialog;
    }

    Vue.mixin({
      created() {
        this.$Dialog = Vue.$Dialog;
      },
    });
  },
};