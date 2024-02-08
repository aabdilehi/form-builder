/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  browserNodeBuiltinsPolyfill: {
    modules: {
      util: true,
      net: true,
      crypto: true,
      http: true,
      url: true,
      events: true,
      fs: true,
      stream: true,
      zlib: true,
      buffer: true,
      string_decoder: true,
      async_hooks: true,
      path: true,
      querystring: true,
    },
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
