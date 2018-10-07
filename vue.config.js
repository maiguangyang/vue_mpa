
const webpack = require('webpack');
const path    = require('path');
const fs      = require('fs-extra');

// 查找中间件文件
const projectDir = [];
const readDir = fs.readdirSync(path.join(__dirname, '.', 'src/common/middlewares'));
readDir.forEach((name) => {
  if (name.replace(/.+\./, '') === 'js') {
    projectDir.push(/(.*)\.[^.]+$/.exec(name)[1]);
  }
});

module.exports = {
  configureWebpack:  {
    resolve: {
      alias: {
        // vue$: 'vue/dist/vue.js',
        '@mobile' : path.resolve('src/app/mobile'),
        '@admin'  : path.resolve('src/app/admin'),
      },
    },

    externals: {
      vue          : 'Vue',
      'vue-router' : 'VueRouter',
      vuex         : 'Vuex',
      axios        : 'axios',
      moment       : 'moment',
      lodash: {
        commonjs  : 'lodash',
        commonjs2 : 'lodash',
        amd       : 'lodash',
        root      : '_',
      },
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          iview: {
            chunks    : 'all',
            test      : /[\\/]iview[\\/]/,
            name      : 'iview',
            minChunks : 1,
          },
        },
      },
    },


    plugins: [
      new webpack.DefinePlugin({
        __MIDDLEWARE__: JSON.stringify(projectDir),
      }),
    ],
  },

  productionSourceMap: false,

  pages: {
    mobile: {
      entry    : 'src/app/mobile/main.js',
      template : 'public/index.html',
      filename : 'mobile/index.html',
      title    : 'Index Page',
      chunks   : ['chunk-vendors', 'chunk-common', 'mobile'],
    },

    admin: {
      entry    : 'src/app/admin/main.js',
      template : 'public/index.html',
      filename : 'admin/index.html',
      title    : 'Admin Page',
      chunks   : ['chunk-vendors', 'chunk-common', 'iview', 'admin'],
    },

  },
};
