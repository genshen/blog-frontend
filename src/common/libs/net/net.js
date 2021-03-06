import axios from 'axios'
import Cookies from 'js-cookie'
import util from '../utils/util'
import Config from '../../config/config'

const net = {}

net.axiosInstance = axios.create({
  timeout: 30000,
  transformRequest: [function (data) {
    // Do whatever you want to transform the data
    let ret = ''
    for (const it in data) {
      ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
    }
    return ret
  }],
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

net.axiosFileInstance = axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'multipart/form-data' }
})

net.getXSRFCookie = function () {
  try { // cookie may be null or something else bad data
    return util.tools.base64_decode(Cookies.get('_xsrf').split('|')[0])
  } catch (err) {
    return ''
  }
}
/**
 * post data to backend
 * @param target target url
 * @param data post data
 * @param config axios config
 * @param onSuccess callback if success
 * @param onError callback if has error (e.g. network error(no network connection))
 * @param onResponseError callback for error in response data.
 * @param onUnAuth callback if backend returns an un auth code.
 * @param cleanup clean up after each post.
 */
net.apiPost = function (target, data, config, onSuccess, onError, onResponseError, onUnAuth, cleanup) {
  if (!onSuccess) {
    onSuccess = function () {
    }
  }
  if (!onError) {
    onError = function () {
    }
  }
  if (!onResponseError) {
    onResponseError = function () {
    }
  }
  if (!onUnAuth) {
    onUnAuth = function () {
    }
  }
  if (!cleanup) {
    cleanup = function () {
    }
  }

  if (!Config.isDevMode()) { // ignore in dev mode
    let xsrf
    if (!(xsrf = net.getXSRFCookie())) {
      onError('no xsrf')
      cleanup(0, 'no xsrf')
      return
    }
    data._xsrf = xsrf
  }

  net.axiosInstance.post(target, data, config).then((response) => {
    try { // process response data
      switch (response.data.status) {
        case 0:
          onResponseError(response.data.error)
          cleanup(1, 'error status in response')
          return
        case 1:
          onSuccess(response.data)
          cleanup(2, 'success')
          return
        default:
          cleanup(3, 'unknown status')
      }
    } catch (error) {
      // has error
      onError(error)
      cleanup(4, 'error in processing response')
    }
  }).catch((error) => {
    // console.log(error.response)
    if (error.response.status === 401) {
      onUnAuth()
      cleanup(5, 'un auth')
    } else {
      onError(error)
      cleanup(6, 'error in post')
    }
  })
}

net.axios = {}
net.axios.load_admin_jwt_config = () => {
  const jwt = sessionStorage.getItem(Config.axios.jwt_session_name_admin)
  if (jwt) {
    return { headers: { Authorization: `Bearer ${jwt}` } }
  }
  return {}
}

export default net
