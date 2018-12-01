import Vue      from 'vue';

import Device   from './device';
import Public   from './public';

Vue.use(Device);
Vue.use(Public);

export default {
  Device,
  Public,
};
