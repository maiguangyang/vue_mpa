<template>
  <div class="login">
    <div class="login-inner">
      <div class="login-head">注册账号</div>
      <div class="login-body">
        <Form ref="formData" :model="formData" :rules="ruleInline" :label-width="85">
          <FormItem label="手机号码" prop="username">
            <Input type="text" v-model="formData.username" maxlength="11" placeholder="请输入手机号码">
            </Input>
          </FormItem>
          <FormItem label="登录密码" prop="password">
            <Input type="password" v-model="formData.password" placeholder="请输入登录密码">
            </Input>
          </FormItem>
          <FormItem label="确认密码" prop="password2">
            <Input type="password" v-model="formData.password2" placeholder="请再次输入登录密码">
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
              :loading="loading"
              long
              @click="handleSubmit('formData')">登陆</Button>
          </FormItem>
        </Form>
        <div class="tips">
          <p>技术服务：广州锦皓科技有限公司</p>
          <p><span>电话：020-36480081</span><span>微信：weixin</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'login',
  data() {
    return {
      loading: false,
      formData: {
        username: '',
        password: '',
        password2: '',
      },
      ruleInline: {
        username: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: this.$createValidator('phone', '手机号码格式错误'), trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
        ],
        password2: [
          { required: true, message: '请再次输入登录密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
        ],
      },
    };
  },
  components: {
  },
  methods: {
    handleSubmit(name) {
      this.loading = true;

      this.$refs[name].validate((valid) => {
        if (this.formData.password !== this.formData.password2) {
          this.$Message.error('2次输入的密码不一致');
          setTimeout(() => {
            this.loading = false;
          }, 500);
          return;
        }

        if (valid) {
          this.$Message.success('Success!');
        } else {
          this.$Message.error('请正确填写表单');
          setTimeout(() => {
            this.loading = false;
          }, 500);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100%;
    background-image: url('~@admin/assets/img/login-bg.jpg');
    background-position: 50%;
    background-size: cover;

    .login-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 350px;
      border: 1px solid #e8e8e8;
      border-radius: 5px;
      background: #fff;
      box-shadow: 5px 5px 15px rgba(255, 255, 255, .5);
      transform: translate(-50%, -60%);

      .login-head {
        padding: 0 20px;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #333;
        border-bottom: 1px solid #e8e8e8;
      }

      .login-body {
        padding: 20px;
      }

      .tips {
        text-align: center;
        font-size: 12px;
        color: #999;

        > p > span {
          margin-right: 10px;

          &:last-child {
            margin-right: 0;
          }

        }
      }
    }
  }
</style>

