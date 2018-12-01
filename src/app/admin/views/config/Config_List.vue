<template>
  <div class="role-list-page">
    <div class="wrapper">
      <div class="controller">
        <div class="table">
          <router-link :to="{ name: 'admin.ConfigAdd' }">
            <Button class="export-data" type="primary">
              <Icon type="ios-plus-empty"></Icon>添加权限路由
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
  name: 'authRoleList',
  data() {
    return {
      loading: false,
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
          title: '权限名称',
          key: 'name',
          width : 200,
          align : 'center',
          render: (h, params) => {
            const elm = this.$routes.Check('admin.ConfigDetail') ? 'a' : 'span';
            return h(elm, {
              on: {
                click: () => {
                  if (this.$routes.Check('admin.ConfigDetail')) {
                    this.$router.push({
                      name: 'admin.ConfigDetail',
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
          title: '数据表',
          key: 'table_name',
          width : 200,
          align : 'center',
        },
        {
          title: '附属权限',
          key: 'sub_name',
          width : 200,
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
        {
          title: '操作',
          key: 'action',
          width: 130,
          align: 'center',
          // fixed: 'right',
          render: (h, params) => {
            return h('div', [

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
                      name: 'admin.ConfigEdit',
                      params: {
                        id: params.row.id,
                      },
                    });
                  },
                },
              }, '编辑'),

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
          },
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
  },
  watch: {

  },

  filters: {

  },

  methods: {

    // 获取列表
    handleList() {
      http.Get('Admin.Config.Seting', {
        params: {
          page: this.formTemp.page,
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
        item.updated_at = this.$options.filters.formatTime(item.updated_at);
        item.created_at = this.$options.filters.formatTime(item.created_at);
      });

    },

    // 是否要删除该条记录
    handleAsync(params) {
      this.$Modal.confirm({
        title   : '温馨提示',
        content : '<p>是否要删除该条记录</p>',
        loading : true,
        closable: true,
        onOk    : () => {
          setTimeout(() => {
            this.handleDelete(params);
          }, 500);
        },
      });
    },

    // 删除记录
    handleDelete(item) {
      if (item.row) {
        http.Delete('Admin.Config.Seting', {
          data: {
            id: _.get(item, 'row.id') * 1,
          },
        })
        .then((res) => {
          this.$Modal.remove();
          if (res.code * 1 === 0) {
            this.$Message.success(res.data);
            this.formTemp.data.splice(item.index, 1);

            if (_.isEmpty(this.formTemp.data)) {
              this.handleList();
            }
            else {
              this.sortData();
            }
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
  },
};
</script>


<style lang="scss" scoped>
  .role-list-page {
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