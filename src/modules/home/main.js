// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
// import VueTopProgress from 'vue-top-progress'
import Routers from './router'
import App from './app.vue'

import '@/sass/base.scss' // material design style
import('vuetify/dist/vuetify.min.css')

Vue.config.productionTip = false

// Vue.use(VueTopProgress)
Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: Routers,
  render: h => h(App)
})
