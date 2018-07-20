// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import Util from '@/common/libs/utils/util'
import SignIn from './sign_in.vue'

import('vuetify/dist/vuetify.min.css')

Vue.config.productionTip = false

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router: Routers,
  render: h => h(SignIn),
  mounted () {
    Util.title('登录')
  }
})
