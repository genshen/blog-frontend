// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import '@/plugins/vuetify'
import '@/plugins/vuetify_snackbar'
import Routers from './router'
import Locales from './locales'
import App from './app.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: Routers,
  i18n: Locales,
  render: h => h(App)
})
