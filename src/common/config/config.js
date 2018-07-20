import api from './api'
import pages from './pages'

const env = process.env.NODE_ENV
let config = {
  ajaxDomain: env === 'development'
    ? 'http://localhost:8090' // location.origin
    : env === 'production'
      ? 'https://gensh.me'
      : 'https://debug.gensh.me',
  api: api,
  pages: pages,
  blog: {
    maxCommentLength: 20
  },
  jwt: {
    jwt_session_name_admin: '_jwt',
    jwt_koten_request_name: '_jwt'
  }
}

config.isDevMode = function () {
  return env === 'development'
}

export default config
