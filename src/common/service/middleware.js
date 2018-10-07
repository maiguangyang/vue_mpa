import { stringify } from 'querystring';


export async function getMiddlewares(names) {
  const middlewares = {};
  try {
    await Promise.all(names.map(async (name) => {
      middlewares[name] = (await import(`@/common/middlewares/${name}.js`)).default;
    }));
    return middlewares;
  }
  catch (e) {
    return Promise.reject(e);
  }
}

export function getClientContext(context, app) {

  const ctx = {
    isClient: true,
    app,
    store: context.store,
    route: context.to,
    from: context.from,
  };

  ctx.params = ctx.route.params || {};
  ctx.query  = ctx.route.query || {};
  ctx.redirect = ({ status = 302, path = '', query = {}, external = false }) => {
    ctx._redirected = true;
    context.next({
      path,
      query,
      status,
      external,
    });
  };

  return ctx;
}

export function promisify(fn, context) {
  let promise;

  if (fn.length === 2) {
    // fn(context, callback)
    promise = new Promise((resolve, reject) => {
      fn(context, (err, data) => {
        if (err) {
          // 错误处理
          context.error(err);
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
  }
  else {
    promise = fn(context);
    if (!promise || (!(promise instanceof Promise) && (typeof promise.then !== 'function'))) {
      promise = Promise.resolve(promise);
    }
  }

  return promise;
}

export async function execSeries(promises, context) {
  for (let i = 0; i < promises.length; i++) {
    if (context._redirected) {
      return;
    }
    await promisify(promises[i], context);
  }
}

let isInitialRoute = true;

export function handleMiddlewares(router, store, App) {

  let app;
  setTimeout(async () => {
    app = await new App().$mount('#app');
  }, 0);

  router.beforeEach(async (to, from, next) => {
    if (!isInitialRoute && to.path === from.path) {
      return next();
    }

    isInitialRoute = false;
    const matchedComponents = router.getMatchedComponents(to);

    // all + client + components middlewares
    /* eslint-disable */
    let middlewareNames = [
      ...(__MIDDLEWARE__ || []),
      ...matchedComponents
          .filter(({middleware}) => !!middleware)
          .reduce((arr, {middleware}) => arr.concat(middleware), [])
    ];

    /* eslint-enable */
    // get all the middlewares defined by user
    const middlewares = await getMiddlewares(middlewareNames);

    const unknowMiddleware = middlewareNames.find(name => typeof middlewares[name] !== 'function');
    if (unknowMiddleware) {
      throw new Error(`Unknown middleware ${unknowMiddleware}`);
    }

    let nextCalled = false;
    const nextRedirect = (opts) => {

      if (nextCalled) {
        return;
      }

      nextCalled = true;

      if (opts.external) {
        opts.query = stringify(opts.query);
        opts.path = opts.path + (opts.query ? '?' + opts.query : '');

        window.location.replace(opts.path);
        return next();
      }
      next(opts);
    };

    // create a new context for middleware, contains store, route etc.
    const contextInMiddleware = getClientContext({
      to,
      from,
      store,
      next: nextRedirect,
    }, app);

    window.vm = app;

    const matchedMiddlewares = middlewareNames.map(name => middlewares[name]);
    await execSeries(matchedMiddlewares, contextInMiddleware);

    if (!nextCalled) {
      next();
    }
  });
}
