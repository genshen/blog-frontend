import Config from '../../common/config/config'

const API_PREFIX = Config.ajaxDomain + Config.apiPrefix
const map = {
  app: {
    settings: Config.ajaxDomain + '/settings'
  },
  list: {
    category: API_PREFIX + '/category'
  },
  detail: {
    content (postId) {
      return API_PREFIX + '/detail/' + postId
    },
    comments (postId, startIndex) {
      return API_PREFIX + '/comments/' + postId + '/' + startIndex
    },
    commentAdd: API_PREFIX + '/comment/add/',
    replyAdd: API_PREFIX + '/reply/add/'
  }
}
export default map
