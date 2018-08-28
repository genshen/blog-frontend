module.exports = {
    // A directory (relative to outputDir) to nest generated static assets (js, css, img, fonts) under.
    assetsDir: "static",
    pages: {
        index: {
            // entry for the page
            entry: 'src/modules/home/main.js',
            // the source template
            template: 'src/templates/index.ejs',
            // output as dist/index.html
            filename: 'views/home/index.html',
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Index Page',
            // chunks to include on this page, by default includes
            // extracted common chunks and vendor chunks.
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        sign_in: {
            entry: 'src/modules/admin/auth/sign_in.js',
            template: 'src/templates/index.ejs',
            filename: 'views/admin/auth/sign_in.html',
            title: 'Admin Sign In',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        panel: {
            entry: 'src/modules/admin/panel/main.js',
            template: 'src/templates/index.ejs',
            filename: 'views/admin/panel/index.html',
            title: 'Admin Panel',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
    },
    css: {
        // Whether to enable source maps for CSS. Setting this to true may affect build performance.
        sourceMap: true
    }
// todo proxyTable
}
