const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/v2/barong",
    createProxyMiddleware({
      target: "https://st.bydep.com/api/v2/barong",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      changeOrigin: true,
      pathRewrite: {
        "^/api/v2/barong": "",
      },
    })
  );

  app.use(
    "/api/v2/peatio",
    createProxyMiddleware({
      target: "https://st.bydep.com/api/v2/peatio",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      changeOrigin: true,
      pathRewrite: {
        "^/api/v2/peatio": "",
      },
    })
  );
};
