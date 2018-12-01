<template>
  <div class="user-detail-page">
    <div class="wrapper">
      <div class="controller">
        <Tabs type="card" class="tabs">
          <TabPane label="编辑角色">
            <Row type="flex" align="bottom" class="input-group" :gutter="16">
              <Col :xs="24" :sm="16" :md="12" :lg="8" class="input-item">
                <Form ref="form" :model="formData" label-position="right" :label-width="100"  @submit.prevent="handleSumbit">
                  <FormItem label="角色名称："
                    prop="name"
                    :rules="{required: true, message: '请输入角色名称', trigger: 'blur'}">
                    <Input v-model="formData.name" clearable placeholder="请输入角色名称"></Input>
                  </FormItem>

                  <FormItem label="所属部门：" prop="gid">
                    <Select v-model="formData.gid" clearable>
                      <Option v-for="(item, index) in formTemp.group" :value="item.id" :key="item.id + index">
                        {{ item.name }}
                      </Option>
                    </Select>
                  </FormItem>

                  <FormItem label="跨部门权限：">
                    <i-switch v-model="formTemp.auth" size="large">
                      <span v-for="(item, index) in $options.filters.stride([])" :key="index" :slot="1 === item.value * 1 ? 'open' : 'close'">{{ item.label }}</span>
                    </i-switch>
                    <Tag color="warning" style="margin-left: 10px">跨部门使用权限</Tag>
                  </FormItem>

                  <FormItem label="状态：">
                    <i-switch v-model="formTemp.state" size="large">
                      <span v-for="(item, index) in $options.filters.state([])" :key="index" :slot="1 === item.value * 1 ? 'open' : 'close'">{{ item.label }}</span>
                    </i-switch>
                  </FormItem>

                  <FormItem>
                    <Button type="primary" :loading="loading" @click="handleSumbit">保存</Button>
                    <router-link :to="{ name: 'admin.AuthRoleList'}">
                      <Button style="margin-left: 8px">返回</Button>
                    </router-link>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </TabPane>

          <TabPane label="权限配置">
            <div class="auth-table">
              <div class="auth-head">
                <div class="head-text">名称</div>
                <div class="head-text">新增</div>
                <div class="head-text">修改/审核</div>
                <div class="head-text">列表</div>
                <div class="head-text">查看</div>
                <div class="head-text">删除</div>
              </div>


              <div class="auth-body">
                <div v-show="formTemp.routes.length <= 0" class="no-data">
                  请先使用总帐号初始化权限列表
                </div>
                <div v-show="formTemp.routes.length > 0" v-for="(item, index) in formTemp.routes" :key="index" class="auth-item">
                  <div class="child-item">{{ item.name }}</div>

                  <div v-for="tye in formTemp.type" :key="tye" class="child-item" @click="handleCheckChange(item, tye)">
                    <Tooltip :content="item.type[tye].tips" :disabled="!item.type[tye].disabled" placement="top">
                      <Checkbox v-model="item.type[tye].value"
                        :disabled="item.type[tye].disabled"
                        :true-value="1"
                        :false-value="0">
                      </Checkbox>
                    </Tooltip>
                  </div>

                </div>
              </div>
            </div>

            <div class="button-group">
              <Button type="primary" :loading="loading" @click="handleSumbit">保存</Button>
              <router-link :to="{ name: 'admin.AuthRoleList'}">
                <Button style="margin-left: 8px">返回</Button>
              </router-link>
            </div>


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
      testValue: false,
      formTemp: {
        type  : ['add', 'edit', 'list', 'info', 'del'],
        state : true,
        auth  : false,
        group : [],
        routes: [],
      },
      formData: {
        name  : '',
        state : 1,
        auth  : 2,
        gid   : null,
      },
      lastData: {},
    };
  },
  created() {
    this.handleAuthList();
    this.handleGroupList();
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
     // 权限改变
    handleCheckChange(data, type) {
      // 只有非选中状态才能点击
      if (data.type[type].disabled !== true) {
        const typeArr = [type];
        if (type === 'edit') {
          typeArr.push('info');
        } else if (type === 'del') {
          typeArr.push('list');
        }

        data.type[type].value    = data.type[type].value === 0 ? 1 : 0;
        data.type[type].oldValue = data.type[type].value;

        _.each(typeArr, (item) => {
          this.handleSubIdChange(data, item, 0);
        });
      }
    },

    // 附属权限选中
    handleSubIdChange(data, type, sub = 0) {
      if (type === 'info') {
        if (data.type.edit.value === 1) {
          data.type[type].value = 1;
          data.type[type].disabled = true;
          data.type[type].tips = '修改/审核附属权限';
        }
        else if (_.isEmpty(data.sub_id)) {
          data.type[type].value    = data.type[type].oldValue === 1 ? 1 : 0;
          data.type[type].disabled = false;

        }
        else if (sub === 0) {
          data.type[type].value = data.type[type].oldValue === 1 ? 1 : 0;
          data.type[type].disabled = data.type.edit.value === 1 ? true : false;
        }
      }

      if (type === 'list') {
        if (data.type.del.value === 1) {
          data.type[type].value = 1;
          data.type[type].disabled = true;
          data.type[type].tips = '删除附属权限';
        }
        else if (_.isEmpty(data.sub_id)) {
          data.type[type].value    = data.type[type].oldValue === 1 ? 1 : 0;
          data.type[type].disabled = false;
        }
        else if (sub === 0) {
          data.type[type].value = data.type[type].oldValue === 1 ? 1 : 0;
          data.type[type].disabled = data.type.del.value === 1 ? true : false;
        }
      }

      // 反向查找父级的权限，如果存在，则true
      const objSubItem = _.find(this.formTemp.routes, { sub_id: [data.id] });
      if (objSubItem && objSubItem.type[type].value === 1) {
        data.type[type].disabled = true;
      }

      // 如果附属权限id不为空
      if (!_.isEmpty(data.sub_id)) {
        // 附属Id转成array
        data.sub_id = _.isString(data.sub_id) ? data.sub_id.split(',') : data.sub_id;

        // 根据附属权限id循环并且查找
        _.each(data.sub_id, (item) => {
          const arrItem = _.find(this.formTemp.routes, { id: item * 1 });
          if (!_.isEmpty(arrItem)) {
            const gl = type === 'info' && arrItem.type.edit.value === 1 || type === 'list' && arrItem.type.del.value === 1;
            const glTips = type === 'info' ? '修改' : '删除';

            let value    = data.type[type].value === 1 ? 1 : 0;
                value    = gl ? 1 : value;
            let disabled = data.type[type].value === 1 ? true : false;
                disabled = gl ? true : disabled;

            let tips = data.type[type].value === 1 ? `${data.name}附属权限` : null;
                tips = gl ? `${glTips}附属权限` : tips;

            // 判断历史值是否选择状态
            if (data.type[type].value === 0 && arrItem.type[type].oldValue === 1) {
              value    = 1;
              disabled = gl ? true : false;
            }

            arrItem.type[type] = _.assign({}, arrItem.type[type], {
              value,
              disabled,
              tips,
            });

            if (!_.isEmpty(arrItem.sub_id)) {
              this.handleSubIdChange(arrItem, type, 1);
            }

          }
        });
      }
    },

    // 获取权限配置列表
    handleAuthList() {
      http.Get('Admin.Config.Seting', {
        params: {
          page: this.formTemp.page,
          count: 50000,
        },
      })
      .then((res) => {
        if (res.code === 0) {
          const data = res.data;
          _.each(data.data, (item) => {
            // 遍历 add edit list info del
            item.type = {};
            _.each(this.formTemp.type, (tye) => {
              item.type[tye] = {
                disabled : false,
                value    : 0,
                oldValue : 0,
              };
            });

            // item.sub_id = item.sub_id ? item.sub_id.split(',') : [];

            const subId = item.sub_id ? item.sub_id.split(',') : [];
            item.sub_id = [];

            _.each(subId, (data) => {
              item.sub_id = _.concat(item.sub_id, data * 1);
            });

            if (!_.isEmpty(item.routes)) {
              try {
                item.routes = JSON.parse(item.routes);
              } catch (err) {
                item.routes = [];
              }
            }
          });

          this.formTemp = _.assign({}, this.formTemp, {
            routes: data.data,
          });
        }
      });
    },

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

          this.formTemp = _.assign({}, this.formTemp, {
            group: data.data,
          });
        }
      });
    },

    // 获取详情
    handleDetail() {
      const id = _.get(this.$route, 'params.id');

      if (id) {
        http.Get('Admin.Auth.Role', {
          id,
        })
        .then((res) => {
          if (res.code === 0) {
            const data = res.data;
            this.formTemp.state = data.state === 1 ? true : false;
            this.formTemp.auth = data.auth.auth === 1 ? true : false;

            if (!_.isEmpty(data.auth)) {
              try {
                data.auth.content = JSON.parse(data.auth.content);
              } catch (err) {
                data.auth.content = [];
              }
            }

            this.formData = _.assign({}, this.formData, data);
            this.lastData = _.assign(this.lastData, this.formData);
            this.handleAuthJson();
          }
          else {
            this.$router.push({
              name: 'admin.AuthRoleList',
            });
          }
        })
        .catch((err) => {
          this.$Notice.error({
            title: err.message,
          });

          this.$timer = setTimeout(() => {
            this.$router.push({
              name: 'admin.AuthRoleList',
            });
          }, 2000);

          this.$Bus.$emit('timer', this.$timer);
        });
      }
    },

    // 解析auth值
    handleAuthJson() {
      const auth = _.get(this.formData, 'auth') || {};
      if (!_.isEmpty(auth)) {
        const content = auth.content;
        if (!_.isEmpty(content)) {
          let subIdArr = [];
          _.each(content, (item) => {

            const index = _.findIndex(this.formTemp.routes, { id: item.id });

            if (index !== -1) {
              const childItme = this.formTemp.routes[index];
              // 解析赋值到权限里面
              childItme.type = _.assign({}, childItme.type, item.type);
              if (childItme.type.edit.value === 1) {
                childItme.type.info.disabled = true;
                childItme.type.info.tips     = '修改/审核附属权限';
              }

              // 附属权限
              if (!_.isEmpty(childItme.sub_id)) {
                _.each(childItme.sub_id, (sid) => {
                  _.each(item.type, (tye, key) => {
                    subIdArr = _.concat(subIdArr, {
                      id   : sid,
                      tips : `${childItme.name}附属权限`,
                      type : key,
                    });
                  });

                });
              }
            }
          });

          _.each(subIdArr, (item) => {
            const sItem = _.findIndex(this.formTemp.routes, { id: item.id });
            if (sItem !== -1) {
              this.formTemp.routes[sItem].type[item.type].value    = 1;
              this.formTemp.routes[sItem].type[item.type].disabled = true;
              this.formTemp.routes[sItem].type[item.type].tips     = item.tips;
            }
          });
        }

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

        http.Put('Admin.Auth.Role', this.formData)
        .then((res) => {
          if (res.code === 0) {
            this.handleAuthSumbit();
          }
        })
        .catch((err) => {
          this.$Notice.error({
            title: err.message,
          });
        });

      });
    },

    // 保存权限
    handleAuthSumbit() {
      const data = this.formTemp.routes;
      let sid    = [];
      let array  = [];

      _.each(data, (item) => {
        _.each(['add', 'edit', 'list', 'info', 'del'], (tye) => {
          if (item.type[tye].value === 1) {
            if (_.indexOf(sid, item.id) === -1) {
              sid = _.concat(sid, item.id);
            }

            const index = _.findIndex(array, { id: item.id });
            if (index === -1) {
              array = _.concat(array, {
                id: item.id,
                name: item.table_name,
                type: {
                  [tye]: {
                    disabled : false,
                    value    : item.type[tye].value,
                    oldValue : item.type[tye].value,
                  },
                },
              });
            }
            else {
              array[index].type[tye] = {
                disabled : false,
                value    : item.type[tye].value,
                oldValue : item.type[tye].value,
              };
            }
          }
        });
      });

      const id  = _.get(this.formData, 'auth.id');
      const rid = _.get(this.$route, 'params.id');
      if (rid) {
        // 保存到权限表
        const reqData = _.assign({}, {
          id,
          rid: rid * 1,
          sid: sid.join(','),
          auth: this.formTemp.auth ? 1 : 2,
          content : JSON.stringify(array),
        });

        http.Put('Admin.Config.Auth', reqData)
        .then((res) => {
          if (res.code === 0) {
            this.$Notice.success({
              title: res.data,
              desc: '权限已更改，刷新2次立即生效',
            });
            this.$router.push({
              name: 'admin.AuthRoleList',
            });
          }

        })
        .catch((err) => {
          this.$Notice.error({
            title: err.message,
          });

          this.$timer = setTimeout(() => {
            this.$router.push({
              name: 'admin.AuthRoleList',
            });
          }, 2000);

          this.$Bus.$emit('timer', this.$timer);
        });

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

    .auth-table {
      margin: 20px 10px;
      border: 1px solid #ddd;

      .auth-head {
        display: flex;
        border-bottom: 1px solid #ddd;

        .head-text {
          display: flex;
          flex: 1 0 0;
          height: 40px;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          border-right: 1px solid #e8eaec;
          background: #f8f8f9;

          &:last-child {
            border-right: none;
          }
        }
      }

      .auth-body {
        flex-direction: column;

        .no-data {
          padding: 20px;
          text-align: center;
        }

        .auth-item {
          display: flex;
          flex: 1 0 0;
          border-bottom: 1px solid #e8eaec;

          &:last-child {
            border-bottom: none;
          }

          .child-item {
            display: flex;
            flex: 1 0 0;
            height: 48px;
            justify-content: center;
            align-items: center;
            text-align: center;
            border-right: 1px solid #e8eaec;

            &:last-child {
              border-right: none;
            }
          }
        }
      }
    }

    .button-group {
      padding: 10px;
    }

    .button {
      padding-top: 30px;
    }
  }

</style>