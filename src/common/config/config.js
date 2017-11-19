const env = process.env.NODE_ENV
let config = {
  ajaxDomain: env === 'development'
    ? 'http://localhost:80'
    : env === 'production'
      ? 'https://gensh.me'
      : 'https://debug.gensh.me',
  apiPrefix: '/at',
  blog: {
    maxCommentLength: 20
  }
}
export default config
