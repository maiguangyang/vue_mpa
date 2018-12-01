<template>
  <div class="user-edit-page">
    <div class="wrapper">
      <div class="controller">
        <Tabs type="card" class="tabs">
          <TabPane label="基本信息">
            <Row type="flex" align="bottom" class="input-group" :gutter="16">
              <Col :xs="24" :sm="16" :md="12" :lg="8" class="input-item">
                <Form ref="formData"
                  :model="formData"
                  label-position="right"
                  :label-width="100"
                  :rules="ruleInline">

                  <FormItem label="手机号码：">
                    <span>{{ formData.phone }}</span>
                  </FormItem>

                  <FormItem label="员工姓名：" prop="username">
                    <Input type="text" v-model="formData.username"></Input>
                  </FormItem>

                  <FormItem label="密码：" prop="password">
                    <Input type="password" v-model="formData.password"></Input>
                  </FormItem>

                  <FormItem label="确认密码：" prop="password1">
                    <Input type="password" v-model="formData.password1"></Input>
                  </FormItem>

                  <FormItem label="性别：">
                    <RadioGroup v-model="formData.sex">
                      <Radio v-for="(item, index) in $options.filters.sex([])" :key="index" :label="item.label"></Radio>
                    </RadioGroup>
                  </FormItem>

                  <FormItem label="所属部门：" prop="group">
                    <Select v-model="formData.group" multiple>
                      <Option v-for="(item, index) in formTemp.group"
                        :key="item.id + index"
                        :disabled="item.roles.length <= 0"
                        :value="item.id + ''"
                        :label="item.name">
                        <span>{{ item.name }}</span>
                        <span style="float:right; padding-right: 20px; color:#ccc">{{ item.roles.length }}个职位</span>
                      </Option>
                    </Select>
                  </FormItem>

                  <FormItem label="所任职位：" prop="role">
                    <Select v-model="formData.role" multiple>
                      <OptionGroup v-for="(item, index) in formTemp.role" :key="item.id" :label="item.name">
                        <Option v-for="child in item.role" :key="index + child.id" :value="child.id + ''">{{ child.name }}</Option>
                      </OptionGroup>
                    </Select>
                  </FormItem>

                  <FormItem label="入职时间：" prop="entry_time">
                    <DatePicker v-model="formData.entry_time" type="date" style="width: 100%" placeholder="请选择入职时间"></DatePicker>
                  </FormItem>

                  <FormItem label="月薪：">
                    <InputNumber :min="0"
                      v-model="formData.money"
                      :formatter="value => `${/^\d*(\.?\d{0,2})/g.exec(value)[0]}`"></InputNumber> 元
                  </FormItem>

                  <FormItem label="职位状态：" prop="job_state">
                    <RadioGroup v-model="formTemp.job_state">
                      <Radio v-for="(item, index) in $options.filters.jobState([])" :key="index" :label="item.label"></Radio>
                    </RadioGroup>
                  </FormItem>

                  <FormItem v-show="formData.job_state === 1" label="试用期时间："
                    prop="trial_time"
                    :rules="{required: formData.job_state === 1,
                      type: formData.job_state === 1 ? 'date' : 'string',
                      message: '请选择试用期时间', trigger: 'blur'}">
                    <DatePicker v-model="formData.trial_time" type="date" style="width: 100%" placeholder="请选择试用期时间"></DatePicker>
                  </FormItem>

                  <FormItem v-show="formData.job_state === 2" label="合同到期时间："
                    prop="contract_time"
                    :rules="{required: formData.job_state === 2,
                      type: formData.job_state === 2 ? 'date' : 'string',
                      message: '请选择合同到期时间', trigger: 'blur'}">
                    <DatePicker v-model="formData.contract_time" type="date" style="width: 100%" placeholder="请选择合同到期时间"></DatePicker>
                  </FormItem>

                  <FormItem v-show="formData.job_state === 3" label="离职时间："
                    prop="quit_time"
                    :rules="{required: formData.job_state === 3,
                      type: formData.job_state === 3 ? 'date' : 'string',
                      message: '请选择合同到期时间', trigger: 'blur'}">
                    <DatePicker v-model="formData.quit_time" type="date" style="width: 100%" placeholder="请选择离职时间"></DatePicker>
                  </FormItem>

                  <FormItem label="状态：">
                    <i-switch v-model="formTemp.state" size="large">
                      <span v-for="(item, index) in $options.filters.state([])" :key="index" :slot="1 === item.value * 1 ? 'open' : 'close'">{{ item.label }}</span>
                    </i-switch>
                  </FormItem>

                  <FormItem>
                    <Button type="primary" :loading="loading" @click="handleSumbit('formData')">保存信息</Button>
                    <router-link :to="{ name: 'admin.AuthUserList'}">
                      <Button style="margin-left: 8px">返回</Button>
                    </router-link>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </TabPane>

          <TabPane label="入职档案" :disabled="false === formTemp.isCard">
            <Row type="flex" align="bottom" class="input-group" :gutter="16">
              <Col :xs="24" :sm="16" :md="12" :lg="8" class="input-item">
                <Form ref="archiveData"
                  :model="archiveData"
                  label-position="right"
                  :label-width="100"
                  :rules="ruleArchive">

                  <FormItem label="毕业学校：" prop="school">
                    <Input v-model="archiveData.school"></Input>
                  </FormItem>

                  <FormItem>
                    <Button type="primary" :loading="loading" @click="handleSumbit('archiveData')">保存档案</Button>
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
  name: 'authUserEdit',
  data() {
    return {
      formTemp: {
        state     : true,
        job_state : null,
        role      : [],
        group     : [],
      },
      formData: {
        username  : '',
        password  : '',
        password1 : '',
        money     : 0,
        state     : 1,
        group     : [],
        role      : [],
        sex       : '保密',
      },
      archiveData: {

      },
      dateOption: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        },
      },
      ruleInline: {
        username: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
        ],
        group: [
          { required: true, type: 'array', message: '请选择所属部门', trigger: 'blur' },
        ],
        role: [
          { required: true, type: 'array', message: '请选择所任职位', trigger: 'blur' },
        ],
        entry_time: [
          { required: true, type: 'date', message: '请选择入职时间', trigger: 'blur' },
        ],
        job_state: [
          { required: true, type: 'integer', message: '请选择职位状态', trigger: 'blur' },
        ],

      },
    };
  },
  created() {
    this.handleGroupList();
    this.handleDetail();
  },
  computed: {
    loading() {
      return _.get(this.$store.state, 'spinShow.loading') || false;
    },
  },
  mounted() {
  },
  components: {
  },
  watch: {
    'formData.group'(val, old) {
      if (val !== old) {
        this.handleRoleList();
      }
    },

    'formTemp.job_state'(val, old) {
      if (val !== old) {
        const state = this.$options.filters.jobState(val);
        this.formData.job_state = state;
      }
    },
  },
  methods: {
    // 获取信息
    handleDetail() {
      const id = _.get(this.$route, 'params.id');

      if (_.isNumber(id * 1)) {
        http.Get('Admin.Auth.User', {
          id,
        })
        .then((res) => {
          if (res.code === 0) {
            const data = res.data;
            this.formTemp.state     = data.state === 1 ? true : false;
            data.sex                = this.$options.filters.sex(data.sex);
            data.money              = this.$options.filters.money(data.money);
            data.entry_time         = this.$options.filters.formatDate(data.entry_time);
            data.quit_time          = this.$options.filters.formatDate(data.quit_time);
            data.trial_time         = this.$options.filters.formatDate(data.trial_time);
            data.contract_time      = this.$options.filters.formatDate(data.contract_time);
            data.group              = data.gid ? data.gid.split(',') : null;
            data.role               = data.rid ? data.rid.split(',') : null;
            this.formTemp.job_state = this.$options.filters.jobState(data.job_state);

            this.formData       = _.assign({}, this.formData, data);
            this.lastData = _.assign(this.lastData, this.formData);
          }
          else {
            this.$router.push({
              name: 'admin.AuthUserList',
            });
          }
        })
        .catch((err) => {
          this.$Notice.error({
            title: err.message,
          });

          this.$timer = setTimeout(() => {
            this.$router.push({
              name: 'admin.AuthUserList',
            });
          }, 2000);

          this.$Bus.$emit('timer', this.$timer);
        });
      }
    },

    // 提交
    handleSumbit(name) {

      const data         = _.assign({}, this.formData);
      data.money         = this.$options.filters.formatMoney(data.money);
      data.entry_time    = this.$options.filters.formTimestamp(data.entry_time);
      data.quit_time     = this.$options.filters.formTimestamp(data.quit_time);
      data.trial_time    = this.$options.filters.formTimestamp(data.trial_time);
      data.contract_time = this.$options.filters.formTimestamp(data.contract_time);
      data.sex           = this.$options.filters.sex(data.sex);
      data.state         = this.formTemp.state === true ? 1 : 2;
      data.gid           = data.group.join(',');
      data.rid           = data.role.join(',');

      this.$refs[name].validate((valid) => {

        if (valid === false) {
          this.$Message.error('请检查表单是否填写完整');
          return;
        }

        if (!_.isEmpty(this.formData.password) && this.formData.password !== this.formData.password1) {
          this.$Message.error('2次输入的密码不一致');
          setTimeout(() => {
          }, 500);
          return;
        }

        http.Put('Admin.Auth.User', data, this.lastData)
        .then((res) => {
          if (res.code === 0) {
            this.$Notice.success({
              title: res.data,
            });

            this.$router.push({
              name: 'admin.AuthUserList',
            });
          }

        })
        .catch((err) => {
          this.loading = false;
          this.$Notice.error({
            title: err.message,
          });

          this.$timer = setTimeout(() => {
            // this.$router.push({
            //   name: 'admin.AuthUserList',
            // });
          }, 2000);

          this.$Bus.$emit('timer', this.$timer);
        });

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

    // 获取职位列表
    handleRoleList() {

      if (_.isEmpty(this.formData.group)) {
        this.formData.role = [];
        this.formTemp.role = [];
        return;
      }

      const params = {
        count: 1000,
      };

      if (!_.isEmpty(this.formData.group)) {
        params.filters = _.assign({}, params.filters, {
          group: this.formData.group,
        });
      }

      // 请求
      http.Get('Admin.Auth.Role', {
        params,
      })
      .then((res) => {
        if (res.code === 0) {
          const data = res.data;

          const arr  = [];
          const role = [];

          _.each(data.data, (object) => {
            // 过滤所任职位里面的数据
            const roleIndex = _.indexOf(this.formData.role, object.id + '');
            if (roleIndex !== -1 && _.indexOf(role, object.id + '') === -1) {
              role.push(object.id + '');
            }

            // 重组formTemp.role
            const index = _.findIndex(arr, object.group);
            if (index === -1) {
              const key = object.group;
              delete object.group;

              const val = object;
              key.role  = [val];
              arr.push(key);
            }
            else {
              arr[index].role.push(object);
            }

          });


          this.formData.role = role;
          this.formTemp.role = arr;
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
  },
};
</script>

<style lang="scss" scoped>
  .user-edit-page {

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