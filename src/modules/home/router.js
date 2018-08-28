import Vue from 'vue'
import VueRouter from 'vue-router'
import Util from '@/common/libs/utils/util'

Vue.use(VueRouter)

Vue.filter('formatTime', Util.tools.formatTime)

// 路由配置
const routersMap = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Home'
    },
    component: (resolve) => require(['./views/list.vue'], resolve)
  }, {
    path: '/category/:menu/:sub_menu',
    name: 'category',
    component: (resolve) => require(['./views/list.vue'], resolve)
  }, {
    path: '/detail/:id',
    name: 'detail',
    component: (resolve) => require(['./views/detail.vue'], resolve)
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  }
]

const RouterConfig = {
  mode: 'hash',
  routes: routersMap
}

const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  Util.title(to.meta.title)
  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
