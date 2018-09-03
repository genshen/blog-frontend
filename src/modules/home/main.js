// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import "@babel/polyfill"
import Vue from 'vue'
import '@/plugins/vuetify'
import '@/plugins/vuetify_snackbar'
import VueProgressBar from 'vue-progressbar'
import Routers from './router'
import App from './app.vue'

Vue.config.productionTip = false

Vue.use(VueProgressBar)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: Routers,
  render: h => h(App)
})
