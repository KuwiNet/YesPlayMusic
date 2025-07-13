// vue.config.js
module.exports = {
  // 关闭生产环境 map 文件，减少构建体积
  productionSourceMap: false,

  // 基本路径（生产环境）
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  // 输出目录
  outputDir: 'dist',

  // 静态资源目录
  assetsDir: 'static',

  // 关闭 eslint 在保存时强制检查（可按需开启）
  lintOnSave: process.env.NODE_ENV !== 'production',

  // 兼容 Node 18 及 Webpack 5 的配置
  configureWebpack: {
    // 让 webpack 忽略 electron 相关依赖，避免 Vercel 构建报错
    externals: {
      electron: 'require("electron")',
    },
  },

  // 链式操作 Webpack 配置
  chainWebpack: (config) => {
    // 删除 Vue CLI 默认注入的 limit-chunk-count-plugin
    // 解决 ValidationError: minChunkSize 不再被支持的问题
    config.optimization.delete('limit-chunk-count-plugin');

    // 自定义 chunk 拆分策略
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-vendors',
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: 5,
          chunks: 'all',
          reuseExistingChunk: true,
        },
      },
    });

    // 移除预加载 prefetch / preload（可选，减少请求数）
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
  },

  // 开发服务器配置（本地调试用）
  devServer: {
    port: 8080,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },

  // electron-builder 相关（只在 electron 模式下生效）
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      // 排除某些模块不打包（按需要添加）
      externals: ['electron'],
    },
  },
};
