<template>
  <div class="user-list-page">
    <div class="wrapper">
      <div class="controller">
        <Row type="flex" class="filter-group" :class="{ active: rowToggle }" :gutter="20">
          <Col :xs="24" :sm="12" :md="8" :lg="6" class="filter-item">
            <Row type="flex" justify="center" align="middle">
              <Col span="8" class="child-title">
                <span>职员姓名：</span>
              </Col>
              <Col span="16">
                <Input v-model="filters.username" placeholder="请输入职员姓名搜索">
                  <Button slot="append" icon="ios-search" @click="handleFilterChange()"></Button>
                </Input>
              </Col>
            </Row>
          </Col>

          <Col :xs="24" :sm="12" :md="8" :lg="6" class="filter-item">
            <Row type="flex" justify="center" align="middle">
              <Col span="8" class="child-title">
                <span>手机号码：</span>
              </Col>
              <Col span="16">
                <Input v-model="filters.phone" placeholder="请输入手机号码搜索">
                  <Button slot="append" icon="ios-search" @click="handleFilterChange()"></Button>
                </Input>
              </Col>
            </Row>
          </Col>

          <Col :xs="24" :sm="12" :md="8" :lg="6" class="filter-item">
            <Row type="flex" justify="center" align="middle">
              <Col span="8" class="child-title">
                <span>入职时间：</span>
              </Col>
              <Col span="16">
                <DatePicker :options="dateOption" @on-change="handleDateChange" type="daterange" split-panels placeholder="请选择开始与结束时间" style="width: 100%"></DatePicker>
              </Col>
            </Row>
          </Col>

          <Col :xs="24" :sm="12" :md="8" :lg="6" class="filter-item">
            <Row type="flex" justify="center" align="middle">
              <Col span="8" class="child-title">
                <span>账户状态：</span>
              </Col>
              <Col span="16">
                <Select v-model="filters.state" clearable @on-change="handleFilterChange()">
                  <Option v-for="(item, index) in $options.filters.state([])" :key="index" :value="item.value">{{ item.label }}</Option>
                </Select>
              </Col>
            </Row>
          </Col>

          <Col :xs="24" :sm="12" :md="8" :lg="6" class="filter-item">
            <Row type="flex" justify="center" align="middle">
              <Col span="8" class="child-title">
                <span>所属部门：</span>
              </Col>
              <Col span="16">
                <Select v-model="filters.gid" clearable @on-change="handleFilterChange()" placeholder="请选择所属部门">
                  <Option v-for="(item, index) in formTemp.group" :key="index" :value="item.id">{{ item.name }}</Option>
                </Select>
              </Col>
            </Row>
          </Col>

          <Col :xs="24" :sm="12" :md="8" :lg="6" class="filter-item">
            <Row type="flex" justify="center" align="middle">
              <Col span="8" class="child-title">
                <span>部门职位：</span>
              </Col>
              <Col span="16">
                <Select v-model="filters.rid" clearable @on-change="handleFilterChange()" placeholder="请选择职位">
                  <Option v-for="(item, index) in formTemp.role" :key="index" :value="item.id">{{ item.name }}</Option>
                </Select>
              </Col>
            </Row>
          </Col>

          <Col :xs="24" :sm="12" :md="8" :lg="6" class="filter-item">
            <Row type="flex" justify="center" align="middle">
              <Col span="8" class="child-title">
                <span>职位状态：</span>
              </Col>
              <Col span="16">
                <Select v-model="filters.job_state" clearable @on-change="handleFilterChange()" placeholder="请选择职位状态">
                  <Option v-for="(item, index) in $options.filters.jobState([])" :key="index" :value="item.value">{{ item.label }}</Option>
                </Select>
              </Col>
            </Row>
          </Col>

          <Col :xs="24" :sm="12" :md="8" :lg="6" class="filter-item">
            <Row type="flex" justify="center" align="middle">
              <Col span="8" class="child-title">
                <span>性别：</span>
              </Col>
              <Col span="16">
                <Select v-model="filters.sex" clearable @on-change="handleFilterChange()" placeholder="请选择性别">
                  <Option v-for="(item, index) in $options.filters.sex([])" :key="index" :value="item.value">{{ item.label }}</Option>
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
          <router-link :to="{ name: 'admin.AuthUserAdd' }">
            <Button class="export-data" type="primary">
              <Icon type="ios-plus-empty"></Icon>添加员工
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
  name: 'authUserList',
  data() {
    return {
      loading: false,
      formTemp: {
        data     : [],
        page     : 1,
        total    : 0,
        per_page : 0,
      },
      formData: {
      },
      filters: {
      },
      lastRole: {},
      dateOption: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        },
      },
      formFilterMethod: {
        name       : 'like',
        rangeStart : '>=',
        rangeStop  : '<=',
        entry_time : '>=',
        quit_time  : '<=',
        facilities : 'like',
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
          title: '姓名',
          key: 'username',
          width : 150,
          align : 'center',
        },
        {
          title: '手机号码',
          key: 'phone',
          width : 150,
          align : 'center',
        },
        {
          title: '性别',
          key: 'sex',
          width : 100,
          align : 'center',
        },
        {
          title: '月薪',
          key: 'money',
          width : 120,
          align : 'center',
          sortable: true,
        },
        {
          title : ' 部门',
          key   : 'group',
          width : 200,
          align : 'center',
        },
        {
          title: ' 职位',
          key: 'role',
          width : 200,
          align : 'center',
        },
        {
          title: '职位状态',
          key: 'job_state',
          width : 150,
          align : 'center',
        },
        {
          title: '入职时间',
          key: 'entry_time',
          width : 150,
          align : 'center',
          sortable: true,
        },
        {
          title: '离职时间',
          key: 'quit_time',
          width : 150,
          align : 'center',
          sortable: true,
        },
        {
          title: '账号状态',
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
    this.handleRoleList();
    this.handleGroupList();
  },
  computed: {
    rowToggle() {
      const data = _.get(this.$store.state, 'spinShow.rowToggle') || false;
      return data;
    },
  },
  mounted() {
    // 追加columns
    if (this.$routes.Check('admin.AuthUserEdit') || this.$routes.Check('admin.AuthUserDel')) {
      this.columns.push({
        title: '操作',
        key: 'action',
        width: 130,
        align: 'center',
        // fixed: 'right',
        render: (h, params) => {
          let array = [];

          // 编辑
          if (this.$routes.Check('admin.AuthUserEdit')) {
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
                      name: 'admin.AuthUserEdit',
                      params: {
                        id: params.row.id,
                      },
                    });
                  },
                },
              }, '编辑'),
            ]);
          }

          // 删除
          if (this.$routes.Check('admin.AuthUserDel')) {
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

    this.handleList();
  },
  watch: {
    'filters.gid'(val, old) {
      if (val !== old) {
        this.filters.rid = null;
        this.handleRoleChange();
      }
    },
  },

  filters: {

  },

  methods: {
    // 获取部门列表
    handleGroupList() {
      http.Get('Admin.Auth.Group', {
        params: {
          count: 10000,
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

    // 获取角色列表
    handleRoleList() {
      http.Get('Admin.Auth.Role', {
        params: {
          count: 2000,
        },
      })
      .then((res) => {
        if (res.code === 0) {
          const data = res.data;

          this.formTemp = _.assign({}, this.formTemp, {
            role: data.data,
          });

          this.lastRole.role = this.formTemp.role;
        }
      });
    },

    // 过滤部门或者角色数据并返回
    handleFilterGroupRole(data, key = []) {
      const arr = [];
      for (let i = 0; i < key.length; i++) {
        if (key[i]) {
          const elm = _.filter(data, { id: key[i] * 1 });
          if (!_.isEmpty(elm)) {
            arr.push(elm[0].name);
          }
        }
      }
      return arr.join(',');
    },

    // 获取列表
    handleList() {
      const params = {
        page: this.formTemp.page,
      };

      if (!_.isEmpty(this.filters)) {
        params.filters = JSON.stringify(this.filters);
      }

      http.Get('Admin.Auth.User', {
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
        item.money      = this.$options.filters.money(item.money);
        item.group      = this.handleFilterGroupRole(this.formTemp.group, item.gid.split(','));
        item.role       = this.handleFilterGroupRole(this.formTemp.role, item.rid.split(','));
        item.state      = this.$options.filters.state(item.state);
        item.job_state  = this.$options.filters.jobState(item.job_state);
        item.sex        = this.$options.filters.sex(item.sex);
        item.entry_time = this.$options.filters.formatDate(item.entry_time);
        item.quit_time  = this.$options.filters.formatDate(item.quit_time);
        item.deleted_at = this.$options.filters.formatTime(item.deleted_at);
        item.updated_at = this.$options.filters.formatTime(item.updated_at);
        item.created_at = this.$options.filters.formatTime(item.created_at);
      });
    },

    // 是否要删除该条记录
    handleAsync(params) {
      this.$Modal.confirm({
        title    : '温馨提示',
        content  : '<p>是否要删除该条记录</p>',
        loading  : true,
        closable : true,
        onOk     : () => {
          setTimeout(() => {
            this.handleDelete(params);
          }, 500);
        },
      });
    },

    // 删除记录
    handleDelete(item) {
      if (item.row) {
        http.Delete('Admin.Auth.User', {
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

    // 时间范围改变
    handleDateChange(date) {
      if (!_.isEmpty(date)) {
        this.filters = _.assign({}, this.filters, {
          start_time : parseInt(new Date(date[0]).getTime() / 1000) || '',
          end_time   : parseInt(new Date(date[1]).getTime() / 1000 + 86400) || '',
        });

      }
      this.handleFilterChange();
    },

    // 重组role
    handleRoleChange() {
      const arr        = [];
      _.each(this.lastRole.role, (object) => {
        // 重组formTemp.role
        const index = _.findIndex(arr, object.group);
        if (index === -1) {
          const key = object.group;

          const val = object;
          key.role  = [val];
          arr.push(key);
        }
        else {
          arr[index].role.push(object);
        }
      });

      // 找到部门职位
      const group = _.filter(arr, { id: this.filters.gid });
      if (!_.isEmpty(group)) {
        this.formTemp.role = group[0].role;
      }
    },

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
  .user-list-page {
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