<template>
  <div class="config-edit-page">
    <div class="wrapper">
      <div class="controller">
        <Tabs type="card" class="tabs">
          <TabPane label="修改权限路由">
            <Row type="flex" align="bottom" class="input-group" :gutter="16">
              <Col :xs="24" :sm="16" :md="12" :lg="8" class="input-item">
                <Form ref="form"
                  label-position="right"
                  :label-width="100"
                  :model="formData"
                  :rules="ruleInline">

                  <FormItem label="权限名称：" prop="name">
                    <Input v-model="formData.name" clearable placeholder="请输入权限名称"></Input>
                  </FormItem>

                  <FormItem label="数据表：" prop="table_name">
                    <Select v-model="formData.table_name" clearable>
                      <Option v-for="(item, index) in formTemp.table" :key="item.id + index" :value="item.table_name">
                        {{ item.table_name }}
                      </Option>
                    </Select>
                  </FormItem>

                  <FormItem v-show="formTemp.sub_list.length > 0" label="附属权限：" prop="sub_id">
                    <Select v-model="formData.sub_id" multiple>
                      <Option v-for="(item, index) in formTemp.sub_list" :key="item.id + index" :value="item.id">
                        {{ item.name }}
                      </Option>
                    </Select>
                  </FormItem>

                  <FormItem label="前端路由：" prop="routes">
                    <Select v-model="formData.routes" multiple>
                      <OptionGroup v-for="(item, index) in formTemp.routes"
                        :key="index" :label="item.title">
                        <Option v-for="(child, key) in item.data"
                          :key="key"
                          :value="child.name"
                          :label="child.title">
                          <span>{{ child.title }}</span>
                          <span style="float:right; padding-right: 20px; color:#ccc">{{ child.type }}</span>
                        </Option>
                      </OptionGroup>
                    </Select>
                  </FormItem>

                  <FormItem>
                    <Button type="primary" :loading="loading" @click="handleSumbit">保存</Button>
                    <router-link :to="{ name: 'admin.ConfigList'}">
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

import http   from '@/common/service/http';

export default {
  name: 'ConfigEdit',
  data() {
    return {
      formTemp: {
        table    : [],
        routes   : [],
        sub_list : [],
      },
      formData: {
        name  : '',
        table_name : '',
        childRouter : {},
        routes: [],
      },
      ruleInline: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        table_name: [
          { required: true, message: '请选择数据表', trigger: 'blur' },
        ],
        childRouter: [
          { required: true, type: 'object', message: '请选择路由菜单', trigger: 'blur' },
        ],
        // routes: [
        //   { required: true, type: 'array', message: '请选择路由', trigger: 'blur' },
        // ],
      },
    };
  },
  created() {
    this.handleSubList();
    this.handleOnloadRoutes();
    this.handleTable();
  },
  computed: {
    loading() {
      return _.get(this.$store.state, 'spinShow.loading') || false;
    },
  },
  mounted() {
    this.handleDetail();
    window.aa = this;
  },
  components: {
  },
  watch: {
  },
  methods: {

    // 初始化路由
    handleOnloadRoutes() {
      const data = this.$router.options.routes;
      let array = [];

      _.each(data, (item) => {
        const title = item.meta.title;

        if (_.isEmpty(array)) {
          const data = [];
          _.each(item.children, (child) => {
            data.push({
              title: child.meta.title,
              type: child.meta.type,
              name: child.name,
              path: item.path,
            });
          });

          array = [{
            title,
            data,
          }];
        }
        else {
          const data = [];
          _.each(item.children, (child) => {
            data.push({
              title: child.meta.title,
              type: child.meta.type,
              name: child.name,
              path: item.path,
            });
          });

          array.push({
            title,
            data,
          });
        }

      });

      this.formTemp.routes = array;
    },

    // 获取数据表
    handleTable() {
      http.Get('Admin.Config.Table')
      .then((res) => {
        if (res.code === 0) {
          const data = res.data;
          this.formTemp.table = data;
        }
      });
    },

    // 获取附属权限列表
    handleSubList() {
      http.Get('Admin.Config.Seting', {
        params: {
          page  : 1,
          count : 50000,
        },
      })
      .then((res) => {
        if (res.code === 0) {
          const data = res.data;
          _.each(data.data, (item) => {
            if (!_.isEmpty(item.routes)) {
              try {
                item.routes = JSON.parse(item.routes);
              } catch (err) {
                item.routes = {};
              }
            }
          });

          const id = _.get(this.$route, 'params.id');

          this.formTemp.sub_list = _.filter(data.data, (item) => {
            return item.id !== id * 1;
          });

          // this.formTemp.sub_list = data.data;
        }
      });
    },


    // 获取详情
    handleDetail() {
      const id = _.get(this.$route, 'params.id');

      if (id) {
        http.Get('Admin.Config.Seting', {
          id,
        })
        .then((res) => {

          if (res.code === 0) {
            const data = res.data;

            try {
              data.routes = JSON.parse(data.routes);
            } catch (err) {
              data.routes = [];
            }


            let array = [];
            _.each(data.routes, (item) => {
              array = _.concat(array, item.name);
            });

            data.routes = array;

            const subId = data.sub_id ? data.sub_id.split(',') : [];
            data.sub_id = [];
            _.each(subId, (item) => {
              data.sub_id = _.concat(data.sub_id, item * 1);
            });

            this.formData = _.assign({}, this.formData, data);
            this.lastData = _.assign(this.lastData, this.formData);
          }
          else {
            this.$router.push({
              name: 'admin.ConfigList',
            });
          }
        })
        .catch((err) => {
          this.$Notice.error({
            title: err.message,
          });

          this.$timer = setTimeout(() => {
            this.$router.push({
              name: 'admin.ConfigList',
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


        // 查找路由并解析
        let array = [];
        _.each(this.formData.routes, (item) => {
          _.each(this.formTemp.routes, (child) => {
            const arrayItem = _.filter(child.data, { name: item });
            if (!_.isEmpty(arrayItem)) {
              array = _.concat(array, arrayItem);
            }
          });
        });

        const data = _.assign({}, this.formData, {
          last_table : this.lastData.table_name,
          routes     : JSON.stringify(array),
          sub_id     : this.formData.sub_id ? this.formData.sub_id.join(',') : null,
        });

        http.Put('Admin.Config.Seting', data, this.lastData)
        .then((res) => {
          if (res.code === 0) {
            this.$Notice.success({
              title: res.data,
            });

            this.$router.push({
              name: 'admin.ConfigList',
            });
          }

        })
        .catch((err) => {
          this.$Notice.error({
            title: err.message,
          });

          this.$timer = setTimeout(() => {
            this.$router.push({
              name: 'admin.ConfigList',
            });
          }, 2000);

          this.$Bus.$emit('timer', this.$timer);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .config-edit-page {

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