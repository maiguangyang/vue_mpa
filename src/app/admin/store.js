import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const files = require.context('@admin/store', true, /^\.\/.*\.js$/);
const filenames = files.keys();
const storeData = {};


function getModule(filename) {
  const file = files(filename);
  const module = file.default || file;
  if (module.commit) {
    throw new Error('store/' + filename.replace('./', '') + ' should export a method which returns a Vuex instance.');
  }
  if (module.state && typeof module.state !== 'function') {
    throw new Error('state should be a function in store/' + filename.replace('./', ''));
  }
  return module;
}

function getModuleNamespace(storeData, paths) {
  if (paths.length === 1) {
    return storeData.modules;
  }


  const namespace = paths.shift();

  const nsModule = storeData.modules[namespace] = storeData.modules[namespace] || {};
  nsModule.namespaced = true;
  nsModule.modules = nsModule.modules || {};

  return getModuleNamespace(nsModule, paths);
}


if (typeof storeData !== 'function') {
  storeData.modules = storeData.modules || {};

  for (const filename of filenames) {
    let name = filename.replace(/^\.\//, '').replace(/\.js$/, '');
    const paths = name.split('/');
    const module = getModuleNamespace(storeData, paths);

    name = paths.pop();
    module[name] = getModule(filename);
    module[name].namespaced = true;
  }
}

// export createStore
const createStore = storeData instanceof Function
  ? storeData
  : () => new Vuex.Store(Object.assign({}, storeData, {
    state: storeData.state instanceof Function ? storeData.state() : {},
  }));

for (const filename of filenames) {
  getModule(filename);
}

export default createStore;

// export default new Vuex.Store(storeData);
