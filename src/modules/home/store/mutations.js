import jwt from "jsonwebtoken"
import Config from '@/common/config/config'
import {StateInit, OnAuth, OnUnAuth, UpdateAllState} from './mulations_type'

// make sure all local storage operation about oauth2 is in this file.
export default {
  [StateInit](state) {
    // this init is called in app.mounted function.
    let jwt = localStorage.getItem(Config.axios.jwt_oauth2_session_name)
    if (jwt) {
      saveJwtAndUser(state, jwt)
    } else {
      unSaveJwtAndUser(state)
    }
  },
  [OnAuth](state, jwt) { // set jwt (in vuex and in localStorage) and set auth state
    localStorage.setItem(Config.axios.jwt_oauth2_session_name, jwt)
    saveJwtAndUser(state, jwt)
  },
  [OnUnAuth](state) { // set the auth status as un-auth; and remove jwt data (in vuex and in localStorage).
    localStorage.removeItem(Config.axios.jwt_oauth2_session_name)
    unSaveJwtAndUser(state)
  },
  [UpdateAllState](state, data) {
    updateStateSettings(state, data.settings)
    state.categories = data.categories
    if (data.user) {
      state.user = data.user
    }
  }
}

function updateStateSettings(state, settings) {
  if (settings) {
    if (settings.profile) {
      state.profile.avatar = settings.profile.avatar
      state.profile.url = settings.profile.url
      state.profile.bio = settings.profile.bio
      state.profile.name = settings.profile.name
    }
    if (settings.site_info) {
      state.site_info.name = settings.site_info.name
      state.site_info.source_code = settings.site_info.source_code
    }
    // todo auth site.
    state.auth_sites = settings.auth_sites
  }
}

// set oauth2 state as true, and save jwt token to oauth2_jwt.
// and decode
function saveJwtAndUser(state, jwtToken) {

  // (Synchronous) Returns the decoded payload without verifying if the signature is valid.
  let decoded = jwt.decode(jwtToken)
  try {
    state.user.avatar_url = decoded.avatar_url
    state.user.email = decoded.email
    state.user.html_url = decoded.html_url
    state.user.name = decoded.name
    // set auth state to true.
    state.is_oauth2_passed = true
    state.oauth2_jwt = jwtToken
  } catch (e) {
    unSaveJwtAndUser(state)
  }
}

function unSaveJwtAndUser(state) {
  state.is_oauth2_passed = false
  state.oauth2_jwt = '' // empty token
  state.user = {} // empty user
}
