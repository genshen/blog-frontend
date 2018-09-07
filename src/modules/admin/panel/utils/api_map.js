import Config from '@/common/config/config'

const ADMIN_API_PREFIX = Config.api.admin_api_prefix
const API_PREFIX = Config.ajaxDomain + Config.api.blog_api_prefix
const ADMIN_PREFIX = Config.pages.admin_prefix
// const ADMIN_SIGN_IN_PATH = Config.ajaxDomain + ADMIN_PREFIX + '/auth/sign_in'
const ADMIN_SIGN_OUT_PATH = Config.ajaxDomain + Config.pages.admin_signout_page

/**
 var Config = {
    adminRouter: "/admin",
    apiPrefix: "/admin/api",
    adminAuthPath: "/admin/auth/signin",
    adminSignOutPath: "/admin/auth/signout",
    adminStaticPrefix: "/private",
    markedLibPath: "/assets/dist/js/marked.min.js",
    //todo 资源路径 //cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js，//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.6.0/highlight.min.js
    highlightLibPath: "/assets/dist/js/highlight.min.js",
    mathJaxLibPath: "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=default"
};
 */
const map = {
  common: {
    prefix: ADMIN_PREFIX,
    upload_token: ADMIN_API_PREFIX + '/upload_token'
  },
  article: {
    list: API_PREFIX + '/list',
    publish: ADMIN_API_PREFIX + '/article/publish',
    edit: ''
  },
  category: {
    get: API_PREFIX + '/categories',
    add: ADMIN_API_PREFIX + '/category/add',
    sub_add: ADMIN_API_PREFIX + '/sub_category/add'
  },
  sign_out: ADMIN_SIGN_OUT_PATH
}
export default map
