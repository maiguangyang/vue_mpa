<template>
  <div class="role-detail-page">
    <div class="wrapper">
      <div class="controller">
        <Tabs type="card" class="tabs">
          <TabPane label="角色详情">
            <Row type="flex" align="bottom" class="input-group" :gutter="16">
              <Col :xs="24" :sm="16" :md="12" :lg="8" class="input-item">
                <Form ref="form"
                  :model="formData"
                  label-position="right"
                  :label-width="100"
                  @submit.prevent="handleSumbit">

                  <FormItem label="角色名称：">
                    <Input v-model="formData.name" readonly></Input>
                  </FormItem>

                  <FormItem label="所属部门：">
                    <router-link v-if="formData.group.name && $routes.Check('admin.AuthGroupDetail')" :to="{ name: 'admin.AuthGroupDetail', params: { id: formData.group.id }}">
                      {{ formData.group.name }}
                    </router-link>
                    <span v-else>{{ formData.group.name || '无' }}</span>
                  </FormItem>

                  <FormItem label="修改时间：">
                    <span>{{ formData.updated_at | formatTime }}</span>
                  </FormItem>

                  <FormItem label="添加时间：">
                    <span>{{ formData.created_at | formatTime }}</span>
                  </FormItem>

                  <FormItem label="状态：">
                    <i-switch v-model="formTemp.state" disabled size="large">
                      <span v-for="(item, index) in this.$options.filters.state([])" :key="index" :slot="1 === item.value * 1 ? 'open' : 'close'">{{ item.label }}</span>
                    </i-switch>
                  </FormItem>

                  <FormItem>
                    <router-link v-if="$routes.Check('admin.AuthRoleEdit')" :to="{ name: 'admin.AuthRoleEdit'}">
                      <Button type="primary">编辑</Button>
                    </router-link>
                    <router-link :to="{ name: 'admin.AuthRoleList'}">
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
  name: 'authRoleDetail',
  data() {
    return {
      loading: false,
      formTemp: {
        state  : true,
      },
      formData: {
        name  : '',
        state : 1,
        group : {},
      },
      lastData: {},
    };
  },
  created() {
  },
  computed: {

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
        http.Get('Admin.Auth.Role', {
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
  .role-detail-page {

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