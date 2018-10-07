import http from '@/common/service/http';

export default async ({ app, redirect, route }) => {
  // 把app, redirect, route传到axios全局配置里面
  http.setConfig({ app, redirect, route });
};