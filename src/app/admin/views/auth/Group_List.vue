<template>
  <div class="wechat-page">
    <div class="wrapper">
      <div class="controller">
        <Row type="flex" class="filter-group" :class="{ active: rowToggle }" :gutter="20">
          <Col :xs="24" :sm="12" :md="8" :lg="6" class="filter-item">
            <Row type="flex" justify="center" align="middle">
              <Col span="8" class="child-title">
                <span>状态：</span>
              </Col>
              <Col span="16">
                <Select v-model="filters.state" clearable @on-change="handleFilterChange()" placeholder="请选择状态">
                  <Option v-for="(item, index) in $options.filters.state([])" :key="index" :value="item.value">{{ item.label }}</Option>
                </Select>
              </Col>
            </Row>
          </Col>

          <button type="button" class="row-toggle"
            @click="$store.commit('spinShow/rowToggle');">
            <Icon v-if="!rowToggle" type="ios-arrow-down" size="25" color="#999" />
            <Icon v-else type="ios-arrow-up" size="25" color="#999" />
          </button>
        </Row>

        <div class="table">
          <router-link v-if="$routes.Check('admin.AuthGroupAdd')" :to="{ name: 'admin.AuthGroupAdd' }">
            <Button class="export-data" type="primary">
              <Icon type="ios-plus-empty"></Icon>添加部门
            </Button>
          </router-link>
          <Table ref="selection" :loading="loading" border :columns="columns" :data="formTemp.data"></Table>
        </div>
        <div class="page-list">
          <Page show-total :total="formTemp.total" :current="formTemp.page" :page-size="formTemp.per_page" @on-change="handleChangePage" show-elevator></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import http from '@/common/service/http';

export default {
  name: 'authGroupList',
  data() {
    return {
      loading: false,
      filters: {},
      formTemp: {
        data     : [],
        page     : 1,
        total    : 0,
        per_page : 0,
      },
      columns: [
        {
          title : '编号',
          key   : 'index',
          width : 70,
          align : 'center',
          fixed: 'left',
        },
        {
          title: '名称',
          key: 'name',
          width : 200,
          align : 'center',
          render: (h, params) => {
            const elm = this.$routes.Check('admin.AuthGroupDetail') ? 'a' : 'span';
            return h(elm, {
              on: {
                click: () => {
                  if (this.$routes.Check('admin.AuthGroupDetail')) {
                    this.$router.push({
                      name: 'admin.AuthGroupDetail',
                      params: {
                        id: params.row.id,
                      },
                    });
                  }
                },
              },
            }, params.row.name);
          },
        },
        {
          title: '职位数量',
          key: 'count',
          width : 150,
          align : 'center',
          sortable: true,
          render: (h, params) => {
            const elm = this.$routes.Check('admin.AuthRoleList') ? 'a' : 'span';
            return h(elm, {
              on: {
                click: () => {
                  if (this.$routes.Check('admin.AuthRoleList')) {
                    this.$router.push({
                      name: 'admin.AuthRoleList',
                      params: {
                        id: params.row.id,
                      },
                    });
                  }
                },
              },
            }, params.row.roles.length);
          },
        },
        {
          title: '状态',
          key: 'state',
          width : 150,
          align : 'center',
        },
        {
          title: '修改时间',
          key: 'updated_at',
          width : 170,
          align : 'center',
          sortable: true,
        },
        {
          title: '添加时间',
          key: 'created_at',
          width : 170,
          align : 'center',
          sortable: true,
        },
      ],


    };
  },
  components: {
  },
  created() {
    this.handleList();
  },
  computed: {

  },
  mounted() {
    // 追加columns
    if (this.$routes.Check('admin.AuthGroupEdit') || this.$routes.Check('admin.AuthGroupDel')) {
      this.columns.push({
          title: '操作',
          key: 'action',
          width: 130,
          align: 'center',
          // fixed: 'right',
          render: (h, params) => {
            let array = [];

            // 编辑
            if (this.$routes.Check('admin.AuthGroupEdit')) {
              array = _.concat(array, [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'admin.AuthGroupEdit',
                        params: {
                          id: params.row.id,
                        },
                      });
                    },
                  },
                }, '编辑'),
              ]);
            }

            if (this.$routes.Check('admin.AuthGroupDel')) {
              array = _.concat(array, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.handleAsync(params);
                    },
                  },
                }, '删除'),
              ]);
            }

            return h('div', array);
          },
        });
    }

  },
  watch: {

  },

  filters: {

  },

  methods: {

    // 获取列表
    handleList() {

      const params = {
        page: this.formTemp.page,
      };

      if (!_.isEmpty(this.filters)) {
        params.filters = JSON.stringify(this.filters);
      }

      http.Get('Admin.Auth.Group', {
        params,
      })
      .then((res) => {
        if (res.code === 0) {
          const data = res.data;
          this.formTemp = _.assign({}, this.formTemp, data);
        }
        this.sortData();
      });
    },

    // 切换分页
    handleChangePage(page) {
      this.formTemp.page = page;
      this.handleList();
    },

    // 数据排序
    sortData() {
      _.each(this.formTemp.data, (item, index) => {
        item.index      = ((this.formTemp.page - 1) * this.formTemp.per_page) + index + 1;
        item.state      = this.$options.filters.state(item.state);
        item.deleted_at = this.$options.filters.formatTime(item.deleted_at);
        item.updated_at = this.$options.filters.formatTime(item.updated_at);
        item.created_at = this.$options.filters.formatTime(item.created_at);
      });

    },

    // 是否要删除该条记录
    handleAsync(params) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>是否要删除该条记录</p>',
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.handleDelete(params);
          }, 500);
        },
      });
    },

    // 删除记录
    handleDelete(item) {
      if (item.row) {
        http.Delete('Admin.Auth.Group', {
          data: {
            id: _.get(item, 'row.id') * 1,
          },
        })
        .then((res) => {
          this.$Modal.remove();
          if (res.code * 1 === 0) {
            this.$Message.success(res.data);
            // this.formTemp.data.splice(item.index, 1);

            this.handleList();

            // if (_.isEmpty(this.formTemp.data)) {
            //   this.handleList();
            // }
            // else {
            //   this.sortData();
            // }
          }

        })
        .catch((err) => {
          this.$Notice.error({
            title: err,
          });
          this.$Modal.remove();
        });

      }
    },

    // 筛选
    handleFilterChange() {
      const filters = {};
      _.each(this.filters, (val, key) => {
        if (val) {
          filters[key] = val;
        }
      });

      this.filters = filters;
      this.handleListChange();
    },

    // 搜索条件改变
    handleListChange() {
      this.formTemp.page       = 1;
      this.formTemp.total      = 0;
      this.formTemp.per_page   = 0;
      this.handleList();
    },

  },
};
</script>


<style lang="scss" scoped>
  .wechat-page {
    .table {
      padding: 20px;

      .export-data {
        margin-bottom: 5px;

        .ivu-icon {
          margin-right: 5px;
        }
      }
    }

    .page-list {
      text-align: center;
    }
  }

</style>