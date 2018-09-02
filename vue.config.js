module.exports = {
    // A directory (relative to outputDir) to nest generated static assets (js, css, img, fonts) under.
    assetsDir: "static",
    pages: {
        index: {
            // entry for the page
            entry: 'src/modules/home/main.js',
            // the source template
            template: 'public/index.html',
            // output as dist/index.html
            filename: 'index.html',
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Blog Home',
            // chunks to include on this page, by default includes
            // extracted common chunks and vendor chunks.
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        sign_in: {
            entry: 'src/modules/admin/auth/sign_in.js',
            template: 'public/index.html',
            filename: 'admin/auth/sign_in.html',
            title: 'Admin Sign In',
            chunks: ['chunk-vendors', 'chunk-common', 'sign_in']
        },
        panel: {
            entry: 'src/modules/admin/panel/main.js',
            template: 'public/index.html',
            filename: 'admin/index.html',
            title: 'Admin Panel',
            chunks: ['chunk-vendors', 'chunk-common', 'panel']
        },
    },
    css: {
        // Whether to enable source maps for CSS. Setting this to true may affect build performance.
        sourceMap: true
    },
    devServer: {
      proxy: 'http://localhost:8090'
      // proxyTable: {
      //   '/s/api': {
      //     target: 'http://localhost:8090',
      //     changeOrigin: true,
      //     // pathRewrite: {
      //     //   '^/at': '/at'   //api
      //     // }
      //   }
      // },
    }
}
