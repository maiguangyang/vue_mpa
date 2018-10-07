<template>
  <div class="home">
    <router-link :to="{ name: 'mobile.About' }">About</router-link>
    <div @click="handleTestClick()">Http</div>
  </div>
</template>

<script>

import http from '@/common/service/http';

export default {
  name: 'home',
  data() {
    return {
      formTemp: {},
    };
  },
  components: {
  },
  mounted() {
  },
  methods: {
    handleTestClick() {
      http.Get('Home.weather')
        .then((res) => {
          console.log(res);
        });
    },
  },
};
</script>
