<template>
  <div class="home">
    <router-link :to="{ name: 'mobile.Home' }">Mobile</router-link>
  </div>
</template>

<script>

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
};
</script>
