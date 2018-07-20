let util = {}
util.title = function (title) {
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

util.ui = {
  snackbar (v) {
    $('body').snackbar(v)
  }
}

util.network = {
  postData: {
    config: {
      authUrl: '' // todo
    },
    init: function (url, data, o, onPostSuccess, onUnAuth, onPostError, onError, onFinish) {
      let options = $.extend({}, {
        snackBarAlive: 4000,
        multiError: true,
        showNext: false,
        authUrl: this.config.pages.admin_signin_page
      }, o)
      if (!onError) {
        onError = function () {
          $('body').snackbar({
            content: '出了点错误,请<a href=\'' + window.location.href + '\'>刷新</a>重试',
            alive: options.snackBarAlive
          })
        }
      }
      if (!onPostError) {
        if (options.multiError) {
          onPostError = function (Errors) {
            for (let key in Errors) {
              let err = Errors[key].Errors
              if (err.length > 0) {
                $('body').snackbar({content: err[0].Message, alive: options.snackBarAlive})
                return
              }
            }
          }
        } else {
          onPostError = function (error) {
            $('body').snackbar({content: error, alive: options.snackBarAlive})
          }
        }
      }
      if (!onUnAuth) {
        onUnAuth = function () {
          let url
          if (options.showNext) {
            url = options.authUrl + '?next=' + +document.location.pathname
          } else {
            url = options.authUrl
          }
          $('body').snackbar({content: '请<a href=\'' + url + '\'>登录</a>后进行操作', alive: options.snackBarAlive})
        }
      }
    }
  },
  simpleParseError: {
    options: {},
    init: function (status, error, options) {
      this.options = $.extend({}, {
        snackAlive: 3000,
        errorCallback: function (message) {
          $('body').snackbar({content: message, alive: this.snackTimeout})
        },
        onSuccess: null
      }, options)
      this.execute(status, error)
    },
    execute: function (status, error) {
      switch (status) {
        case 0:
          this.options.errorCallback(error)
          return false
        case 1:
          if (this.options.onSuccess !== null) {
            this.options.onSuccess()
          }
          return true
      }
    }
  }
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

    let b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    let o1, o2, o3, h1, h2, h3, h4, bits
    let i = 0
    let ac = 0
    let dec = ''
    let tmpArr = []

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
      let v = Date.parse(value)
      if (isNaN(v)) {
        value = (new Date()).getTime()
      } else {
        value = v
      }
    }
    let now = (new Date()).getTime()
    if (now - value < 60 * 1000) {
      return '刚刚'
    }
    if (now - value < 60 * 60 * 1000) {
      let min = parseInt((now - value) / (60 * 1000))
      return min + '分钟前'
    }
    if (now - value < 24 * 60 * 60 * 1000) {
      let hour = parseInt((now - value) / (60 * 60 * 1000))
      return hour + '小时前'
    }
    if (now - value < 20 * 24 * 60 * 60 * 1000) {
      let day = parseInt((now - value) / (24 * 60 * 60 * 1000))
      return day + '天前'
    }
    let d = new Date(value)
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  },
  // js load
  loadJS (srcs, cb) {
    'use strict'
    let total = srcs.length
    let hasLoadedCount = 0

    function onLoadCallback () {
      hasLoadedCount++
      if (total === hasLoadedCount && cb && typeof (cb) === 'function') {
        cb()
      }
    }

    for (let index in srcs) {
      let src = srcs[index]
      let ref = document.getElementsByTagName('script')[0]
      let script = document.createElement('script')
      script.src = src
      script.async = true
      ref.parentNode.insertBefore(script, ref)
      script.onload = onLoadCallback
    }
  },
  loadCSS (src, cb) {
    'use strict'
    let head = document.getElementsByTagName('HEAD').item(0)
    let style = document.createElement('link')
    style.href = src
    style.rel = 'stylesheet'
    style.type = 'text/css'
    head.appendChild(style)
    if (cb && typeof (cb) === 'function') {
      style.onload = cb
    }
    return style
  }
}

// util.ajax = axios.create({
//     baseURL: ajaxUrl,
//     timeout: 30000
// });

//
export default util
