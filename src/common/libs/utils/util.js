const util = {}
util.title = (title) => {
  title = title || 'Blog-Home'
  window.document.title = title
}

util.messages = {
  NormalErrorSnackBar: '<a data-dismiss="snackbar">Dismiss</a>' + '<div class="snackbar-text">Oh,Snap! 出了点错误,请' + '<a href="javascript:location.reload() ">刷新</a>' + '后重试.</div>',
  NoAuthCommentSnackBar: '<a data-dismiss="snackbar">Dismiss</a>' + '<div class="snackbar-text">你需要' + '<a data-toggle="modal" data-target="#auth_model">登录认证</a>' + '后才能添加评论.</div>',
  NoAuthReplySnackBar: '<a data-dismiss="snackbar">Dismiss</a>' + '<div class="snackbar-text">你需要' + '<a data-toggle="modal" data-target="#auth_model">登录认证</a>' + '后才能添加回复.</div>',
  SnackbarErrorMessage: 'Oh,Snap! 出了点错误,请刷新后重试.',
  SnackbarNoAuthComment: '你需要 登录认证 后才能添加评论.',
  SnackbarNoAuthReply: '你需要 登录认证 后才能添加回复..'
}

util.tools = {
  // base64_decode
  base64_decode (encodedData) {
    if (typeof window !== 'undefined') {
      if (typeof window.atob !== 'undefined') {
        return decodeURIComponent(unescape(window.atob(encodedData)))
      }
    } else {
      return Buffer.from(encodedData, 'base64').toString('utf-8')
    }

    const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    let o1,
      o2,
      o3,
      h1,
      h2,
      h3,
      h4,
      bits
    let i = 0
    let ac = 0
    let dec = ''
    const tmpArr = []

    if (!encodedData) {
      return encodedData
    }

    encodedData += ''

    do {
      // unpack four hexets into three octets using index points in b64
      h1 = b64.indexOf(encodedData.charAt(i++))
      h2 = b64.indexOf(encodedData.charAt(i++))
      h3 = b64.indexOf(encodedData.charAt(i++))
      h4 = b64.indexOf(encodedData.charAt(i++))

      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4

      o1 = bits >> 16 & 0xff
      o2 = bits >> 8 & 0xff
      o3 = bits & 0xff

      if (h3 === 64) {
        tmpArr[ac++] = String.fromCharCode(o1)
      } else if (h4 === 64) {
        tmpArr[ac++] = String.fromCharCode(o1, o2)
      } else {
        tmpArr[ac++] = String.fromCharCode(o1, o2, o3)
      }
    } while (i < encodedData.length)

    dec = tmpArr.join('')
    return decodeURIComponent(escape(dec.replace(/\0+$/, '')))
  },
  formatTime (value) {
    if (typeof value !== 'number') {
      const v = Date.parse(value)
      if (isNaN(v)) {
        value = (new Date()).getTime()
      } else {
        value = v
      }
    }
    const now = (new Date()).getTime()
    if (now - value < 60 * 1000) {
      return '刚刚'
    }
    if (now - value < 60 * 60 * 1000) {
      const min = parseInt((now - value) / (60 * 1000), 10)
      return `${min}分钟前`
    }
    if (now - value < 24 * 60 * 60 * 1000) {
      const hour = parseInt((now - value) / (60 * 60 * 1000), 10)
      return `${hour}小时前`
    }
    if (now - value < 20 * 24 * 60 * 60 * 1000) {
      const day = parseInt((now - value) / (24 * 60 * 60 * 1000), 10)
      return `${day}天前`
    }
    const d = new Date(value)
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  }
}

// util.ajax = axios.create({
//     baseURL: ajaxUrl,
//     timeout: 30000
// });

//
export default util
