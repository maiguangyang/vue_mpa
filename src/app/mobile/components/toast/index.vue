<template>
  <div class="toast">
    <span>{{text}}</span>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    show: Boolean,
    text: {
      type: String,
      default: '缺少提示内容',
    },
  },
  computed: {
  },
  components: {
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
  @import "../../assets/stylus/_bootstrap";

  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 999999;
    display: inline-block;
    float: none;
    margin: 0;
    padding: rem(20px) rem(60px);
    min-height: 0;
    max-height: auto;
    min-width: 0;
    max-width: 90%;
    width: auto;
    height: auto;
    line-height: rem(50px);
    text-align: center;
    font-size: rem(26px);
    border-radius: rem(10px);
    background-color: rgba(0,0,0,.8);
    box-shadow: none;
    color: #fff;
    pointer-events: none;
    user-select: none;
    transform: translate(-50%, -50%);
    transition: all 500ms ease-in-out;
    animation: toastOut 3.5s;
    animation-fill-mode: forwards;
    word-wrap: break-word;

    &.in {
      opacity: 1;
    }

    &.out {
      opacity: 0;
    }
  }

  @keyframes toastOut
  {
    0%   {opacity: 1;}
    50%  {opacity: 1;}
    100% {opacity: 0;}
  }

</style>