<template>
  <div class="user-detail-page">
    <div class="wrapper">
      <div class="controller">
        <Tabs type="card" class="tabs">
          <TabPane label="添加部门">
            <Row type="flex" align="bottom" class="input-group" :gutter="16">
              <Col :xs="24" :sm="16" :md="12" :lg="8" class="input-item">
                <Form ref="form" :model="formData" label-position="right" :label-width="100"  @submit.prevent="handleSumbit">
                  <FormItem label="部门名称："
                    prop="name"
                    :rules="{required: true, message: '请输入部门名称', trigger: 'blur'}">
                    <Input v-model="formData.name" clearable placeholder="请输入部门名称"></Input>
                  </FormItem>

<!--                   <FormItem label="下级部门："
                    prop="group"
                    :rules="{required: true, message: '请选择下级部门', trigger: 'blur'}">
                    <Select v-model="formData.group" :multiple="multiple" clearable :on-change="handleGroupChange()">
                      <Option v-for="(item, index) in formTemp.group" :value="item.id" :key="item.id + index">
                        {{ item.name }}
                      </Option>
                    </Select>
                  </FormItem> -->

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
      multiple : false,
      formTemp : {
        state : true,
        group  :[
          {
            id   : 0,
            name : '无',
          },
        ],
      },
      formData: {
        name  : '',
        state : 1,
        group : 0,
      },
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
    this.handleGroupList();
  },
  watch: {
    // 'formData.group' (val, old) {
    //   this.formData.group = val;
    //   console.log(val, old);
    // }
  },
  components: {
  },
  methods: {

    // 获取部门列表
    handleGroupList() {
      http.Get('Admin.Auth.Group', {
        params: {
          count: 1000,
        },
      })
      .then((res) => {
        if (res.code === 0) {
          const data = res.data;
          this.formTemp.group = _.concat(this.formTemp.group, data.data);
        }
      });
    },

    // 提交
    handleSumbit() {
      this.$refs.form.validate((valid) => {
        if (valid === false) {
          this.$Message.error('请检查表单是否填写完整');
          return;
        }

        this.formData.state = this.formTemp.state ? 1 : 2;

        http.Post('Admin.Auth.Group', this.formData)
        .then((res) => {
          if (res.code === 0) {
            this.$Notice.success({
              title: res.data,
            });

            const data = res.data;
            this.formTemp.state = data.state === 1 ? true : false;

            this.formData = _.assign({}, this.formData, data);
            this.lastData = _.assign(this.lastData, this.formData);

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
      });
    },

    // 上级部门改变
    handleGroupChange() {
      if (this.formData.group.length > 1) {
        const index = this.formData.group.indexOf(0);

        if (index !== -1) {
          this.formData.group = 0;
          this.multiple       = true;
        }
      }
      else if (this.formData.group === 0) {
        this.multiple = false;
      }
      else {
        this.multiple     = true;
      }
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