<template>
  <transition name="fade">
    <div v-show="formTemp.show"  class="dialog active">
      <div class="content">
        <div class="head">
          <h3> {{ formTemp.title }} </h3>
        </div>
        <div class="main">
          <p>{{ formTemp.content }}</p>
        </div>
        <div class="foot">
        <button v-for="(item, index) in formTemp.button"
          :key="index"
          class="dialog-item"
          @click="handleDialog(item)"
          :class="[{ item: 1 < formTemp.button.length }, item.class]">{{ item.msg }}</button>
      </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Loding',
  data() {
    return {
      formTemp: {
        show    : false,
        title   : '温馨提示',
        content : '',
        button  : [],
      },
    };
  },
  computed: {
  },
  components: {
  },
  methods: {

    handleDialog(item) {
      return item.func ?
        _.extend(item.func(), this.handleDialogClose()) :
        this.handleDialogClose();
    },

    // 关闭Dialog弹窗
    handleDialogClose() {
      this.formTemp.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "../../assets/stylus/_bootstrap";

  .dialog {
    &:before {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      content: ' ';
      background: rgba(0, 0, 0, .3);
      z-index: 99999;
    }

    .content {
      position: fixed;
      top: 50%;
      left: 50%;
      z-index: 999999;
      display: block;
      float: none;
      margin: 0;
      padding:  0;
      min-height: 0;
      max-height: auto;
      min-width: 0;
      max-width: 100%;
      width: 65%;
      height: auto;
      text-align: center;
      font-size: rem(26px);
      border: rem(1px) solid $bc;
      border-radius: rem(12px);
      background-color: #fff;
      box-shadow: none;
      user-select: none;
      transform: translate(-50%, -50%);

      &.fade-enter-active, &.fade-leave-active {
        transition: all 0.3s linear;
      }
      &.fade-enter, &.fade-leave-active {
        opacity: 0;
      }

      .head {
        padding: rem(30px) 0;
        color: #333;
        font-size: rem(28px);

        > h3 {
          line-height: rem(50px);
        }

      }

      .main {
        border-bottom: 1px solid $bc;

        > p {
          display: block;
          padding: 0 rem(20px) rem(20px) rem(20px);
          line-height: rem(42px);
          color: #666;
          text-align: center;
          word-wrap: break-word;

          &.left {
            text-align: left;
          }
        }

        .info-html {
          padding: 0 rem(20px) rem(20px) rem(20px);
          text-align: left;

          .info-item {
            margin-bottom: rem(10px);
            line-height: rem(40px);

            &.color {
              color: #2ea7e0;
            }

          }
        }
      }

      .foot {
        position: relative;
        padding: rem(6px) 0;
        width: 100%;
        height: 100%;

        > button, > p {
          display: inline-block;
          padding: rem(20px);
          width: 100%;
          font-size: rem(26px);
          color: #666;
          border: none;
          background: none;

          &.item {
            float: left;
            width: 50%;
          }

          &.ok {
            color: #01b3f0;
          }

          &:last-child {
            &.item {
              border-left: 1px solid $bc;
            }
          }
        }

        &:after {
          display: block;
          content: ' ';
          clear: both;
        }
      }
    }
  }

  .dialog_simple {

    h3 {
      display: none;
    }

    .dialog-body .item:last-child {
      color: $mainCol;
    }
  }

</style>