<template>
  <div class="login">
    <div class="login-inner">
      <div class="login-head">设置数据库<span>(目前只支持MySql数据库)</span></div>
      <div class="login-body">
        <Form ref="formData" :model="formData" :rules="ruleInline" :label-width="85">
          <FormItem label="数据库地址" prop="data_ip">
            <Input type="text" v-model="formData.data_ip" placeholder="请输入数据库IP地址"></Input>
          </FormItem>
          <FormItem label="数据库端口" prop="data_port">
            <Input type="text" number v-model="formData.data_port" placeholder="请输入数据库端口"></Input>
          </FormItem>
          <FormItem label="数据库账号" prop="data_user">
            <Input type="text" v-model="formData.data_user" placeholder="请输入数据库账号"></Input>
          </FormItem>
          <FormItem label="数据库密码" prop="data_password">
            <Input type="text" v-model="formData.data_password" placeholder="请输入数据库密码"></Input>
          </FormItem>
          <FormItem label="数据库名称" prop="database">
            <Tooltip style="width: 100%" content="可自定义数据库名称" placement="bottom">
              <Input type="text" v-model="formData.database" placeholder="请输入数据库名称"></Input>
            </Tooltip>
          </FormItem>
          <FormItem>
            <Button type="primary"
              :loading="loading"
              long
              @click="handleSubmit('formData')">设置数据库</Button>
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

import http from '@/common/service/http';

export default {
  name: 'login',
  data() {
    return {
      loading: false,
      formData: {
        driver_name   : 'mysql',
        data_user     : 'admin',
        data_password : 'admin',
        data_ip       : '127.0.0.1',
        charset       : 'utf8mb4',
        database      : '',
        data_port     : 3306,
      },
      ruleInline: {
        data_ip: [
          { required: true, message: '请输入数据库IP地址', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur',
          },
        ],
        data_port: [
          { type: 'number', min: 1, required: true, message: '请输入数据库端口', trigger: 'blur' },
        ],
        data_user: [
          { required: true, message: '请输入数据库账号', trigger: 'blur' },
        ],
        data_password: [
          { required: true, message: '请输入数据库密码', trigger: 'blur' },
        ],
        database: [
          { required: true, message: '请输入数据库名称', trigger: 'blur' },
        ],
      },

    };
  },
  components: {
  },
  mounted() {
    this.randomDataBase();
  },
  methods: {
    handleSubmit(name) {
      this.loading = true;

      this.$refs[name].validate((valid) => {
        if (valid) {

          http.Post('Conf.checkDataBase', this.formData)
            .then((res) => {
              console.log(res);
              this.loading = false;
            });

        } else {
          this.$Message.error('请正确填写表单');
          setTimeout(() => {
            this.loading = false;
          }, 500);
        }
      });
    },

    randomDataBase() {
      let str   = '';
      const arr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

      for (let i = 0; i < 18; i++) {
        const pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }

      this.formData = _.assign({}, this.formData, {
        database: str,
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
      width: 400px;
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

        > span {
          font-size: 12px;
          color: #01b3f0;
        }
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

