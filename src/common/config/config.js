import api from './api'
import pages from './pages'

const env = process.env.NODE_ENV
const config = {
  ajaxDomain: env === 'development'
    ? location.origin // 'http://localhost:8090' use http-proxy-middleware
    : env === 'production'
      ? 'https://gensh.me'
      : 'https://debug.gensh.me',
  api,
  pages,
  blog: {
    maxCommentLength: 20
  },
  axios: {
    jwt_session_name_admin: '_jwt',
    jwt_token_request_name: '_jwt',
    jwt_oauth2_session_name: '_jwt_oauth2',
    jwt_oauth2_session_request_name: '_jwt_oauth2'
  }
}

config.isDevMode = function () {
  return env === 'development'
}

export default config
