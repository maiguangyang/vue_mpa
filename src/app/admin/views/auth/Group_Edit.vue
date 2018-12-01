<template>
  <div class="user-detail-page">
    <div class="wrapper">
      <div class="controller">
        <Tabs type="card" class="tabs">
          <TabPane label="编辑部门">
            <Row type="flex" align="bottom" class="input-group" :gutter="16">
              <Col :xs="24" :sm="16" :md="12" :lg="8" class="input-item">
                <Form ref="form" :model="formData" label-position="right" :label-width="100"  @submit.prevent="handleSumbit">
                  <FormItem label="部门名称："
                    prop="name"
                    :rules="{required: true, message: '请输入部门名称', trigger: 'blur'}">
                    <Input v-model="formData.name" clearable placeholder="请输入部门名称"></Input>
                  </FormItem>

                  <FormItem label="状态：">
                    <i-switch v-model="formTemp.state" size="large">
                      <span v-for="(item, index) in $options.filters.state([])" :key="index" :slot="1 === item.value * 1 ? 'open' : 'close'">{{ item.label }}</span>
                    </i-switch>
                  </FormItem>

                  <FormItem>
                    <Button type="primary" :loading="loading" @click="handleSumbit">保存</Button>
                    <router-link :to="{ name: 'admin.AuthGroupList'}">
                      <Button style="margin-left: 8px">返回</Button>
                    </router-link>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

      </div>
    </div>
  </div>
</template>

<script>

import http from '@/common/service/http';

export default {
  name: 'authGroupAdd',
  data() {
    return {
      formTemp: {
        state  : true,
      },
      formData: {
        name  : '',
        state : 1,
      },
      lastData: {},
    };
  },
  created() {
  },
  computed: {
    loading() {
      return _.get(this.$store.state, 'spinShow.loading') || false;
    },
  },
  mounted() {
    this.handleDetail();
  },
  components: {
  },
  methods: {
    // 获取信息
    handleDetail() {
      const id = _.get(this.$route, 'params.id');

      if (id) {
        http.Get('Admin.Auth.Group', {
          id,
        })
        .then((res) => {
          if (res.code === 0) {
            const data = res.data;
            this.formTemp.state = data.state === 1 ? true : false;
            this.formData = _.assign({}, this.formData, data);

            this.lastData = _.assign(this.lastData, this.formData);
          }
          else {
            this.$router.push({
              name: 'admin.AuthGroupList',
            });
          }
        })
        .catch((err) => {
          this.$Notice.error({
            title: err.message,
          });

          this.$timer = setTimeout(() => {
            this.$router.push({
              name: 'admin.AuthGroupList',
            });
          }, 2000);

          this.$Bus.$emit('timer', this.$timer);
        });
      }
    },

    // 提交
    handleSumbit() {
      this.$refs.form.validate((valid) => {
        if (valid === false) {
          this.$Message.error('请检查表单是否填写完整');
          return;
        }

        this.formData.state = this.formTemp.state ? 1 : 2;

        http.Put('Admin.Auth.Group', this.formData, this.lastData)
        .then((res) => {
          if (res.code === 0) {
            this.$Notice.success({
              title: res.data,
            });
            this.$router.push({
              name: 'admin.AuthGroupList',
            });
          }
        })
        .catch((err) => {
          this.$Notice.error({
            title: err.message,
          });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .user-detail-page {

    .input-group {
      padding: 10px;

      .input-item {
        margin: 5px 0;

         .btn {
           background: #ff8b1b;
           border-radius: 10px;
         }

      }

    }

    .button {
      padding-top: 30px;
    }
  }

</style>