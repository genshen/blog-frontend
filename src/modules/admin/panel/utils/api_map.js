import Config from '../../../../common/config/config'

const ADMIN_PREFIX = Config.ajaxDomain + '/admin'
const ADMIN_API_PREFIX = ADMIN_PREFIX + '/api'
const ADMIN_SIGN_OUT_PATH = '/admin/auth/sign_out'

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
    upload_token: ADMIN_API_PREFIX + '/upload_token'
  },
  article: {
    list: ADMIN_API_PREFIX,
    publish: ADMIN_API_PREFIX + '/article/publish/',
    edit: ''
  },
  category: {
    add: ADMIN_API_PREFIX + '/category/add',
    sub_add: ADMIN_API_PREFIX + '/sub_category/add'
  },
  sign_out: ADMIN_SIGN_OUT_PATH
}
export default map
