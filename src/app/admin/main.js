import 'iview/dist/styles/iview.css';
import Vue                    from 'vue';
import iView                  from 'iview';
import Common                 from '@/common';
import { handleMiddlewares }  from '@/common/service/middleware';
import AppComponent           from './App.vue';
import router                 from './router';
import store                  from './store';
import './registerServiceWorker';

Vue.use(iView);

// const store = createStore();
Vue.config.productionTip = false;

const App = Vue.extend({
  router,
  store,
  Common,
  ...AppComponent,
  // render: h => h(App),
});


handleMiddlewares(router, store, App);