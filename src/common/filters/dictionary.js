
/* eslint-disable */
const Dictionary = {
  sex: [
    { label: '保密', value: 0 },
    { label: '男', value: 1 },
    { label: '女', value: 2 },
  ],
  state: [
    { label: '启动', value: 1 },
    { label: '禁用', value: 2 },
  ],
  stride: [
    { label: '是', value: 1 },
    { label: '否', value: 2 },
  ],
  jobState: [
    { label: '试用期', value: 1 },
    { label: '正式员工', value: 2 },
    { label: '离职', value: 3 },
  ],
  money: (data) => {
    if (_.isNumber(data * 1)) {
      return data / 100;
    }
    return 0;
  },
  formatMoney: (data) => {
    if (_.isNumber(data * 1)) {
      return data * 100;
    }
    return null;
  },
  formatTime: (data) => {
    if (!data) {
      return null;
    }

    if (_.isObject(data) && data.Int64) {
      data = data.Int64;
    }

    const formatTime = moment.unix(data).format('YYYY-MM-DD HH:mm:ss');
    // const formatTime = moment.unix(moment(data).unix()).format('YYYY-MM-DD HH:mm:ss');
    return formatTime !== 'Invalid date' ? formatTime : data;
  },
  formatDate: (data) => {
    if (!data) {
      return null;
    }

    if (_.isObject(data) && data.Int64) {
      data = data.Int64;
    }
    const formatTime = moment.unix(data).format('YYYY-MM-DD');
    return formatTime !== 'Invalid date' ? formatTime : data;
  },
  formTimestamp: (data) => {
    const item = moment(new Date(data)).unix();
    return item ? item : data;
  },
};

export default Dictionary;
/* eslint-enable */
