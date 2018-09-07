// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import '@/plugins/vuetify'
import '@/plugins/vuetify_snackbar'
import Util from '@/common/libs/utils/util'
import SignIn from './sign_in.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router: Routers,
  render: h => h(SignIn),
  mounted () {
    Util.title('登录')
  }
})
