// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import Routers from './router'
import App from './app.vue'

// index.js or main.js
import('vuetify/dist/vuetify.min.css')

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: Routers,
  render: h => h(App)
})
