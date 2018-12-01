<template>
  <div class="user-add-page">
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

                  <FormItem label="手机号码：" prop="phone">
                    <Input v-model="formData.phone"></Input>
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
                      message: '请选择试用期时间', trigger: 'blur' }">
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
                      message: '请选择离职时间', trigger: 'blur'}">
                    <DatePicker v-model="formData.quit_time" type="date" style="width: 100%" placeholder="请选择离职时间"></DatePicker>
                  </FormItem>

                  <FormItem label="状态：">
                    <i-switch v-model="formTemp.state" size="large">
                      <span v-for="(item, index) in $options.filters.state([])" :key="index" :slot="1 === item.value * 1 ? 'open' : 'close'">{{ item.label }}</span>
                    </i-switch>
                  </FormItem>

                  <FormItem>
                    <Button type="primary" :loading="loading" @click="handleSumbit('formData')">保存</Button>
                    <router-link :to="{ name: 'admin.AuthUserList'}">
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
  name: 'authUserAdd',
  data() {
    return {
      formTemp: {
        state  : true,
        role   : [],
        group  : [],
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
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: this.$createValidator('phone', '手机号码格式错误'), trigger: 'blur' },
        ],
        username: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: this.$createValidator('password', '请输入6-12位的密码'), trigger: 'blur' },
        ],
        password1: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: this.$createValidator('password', '请输入6-12位的密码'), trigger: 'blur' },
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
  },
  computed: {
    loading() {
      return _.get(this.$store.state, 'spinShow.loading') || false;
    },
  },
  mounted() {
    window.aa = this;
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
        console.log(state);
        this.formData = _.assign({}, this.formData, {
          job_state: state,
        });
      }
    },
  },
  methods: {

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

        if (this.formData.password !== this.formData.password1) {
          this.$Message.error('2次输入的密码不一致');
          setTimeout(() => {
          }, 500);
          return;
        }

        http.Post('Admin.Auth.User', data)
        .then((res) => {
          if (res.code === 0) {
            this.$Notice.success({
              title: '添加成功',
              desc: '请继续添加入职档案信息',
            });

            const data = res.data;
            if (data.uid) {
              this.$router.push({
                name: 'admin.AuthUserEdit',
                params: {
                  id: data.uid,
                },
              });
            }
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

  },
};
</script>

<style lang="scss" scoped>
  .user-add-page {

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