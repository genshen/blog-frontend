// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Routers from './router'
import App from './app.vue'

import '../../../sass/base.scss'  // material design style

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: Routers,
  render: h => h(App)
})