import Vue from 'vue'
import VueRouter from 'vue-router'
import Util from '../../../common/libs/utils/util'
import ApiMap from './utils/api_map'

Vue.use(VueRouter)

// Vue.filter('formatTime', Util.tools.formatTime)

// 路由配置
const routersMap = [
  {
    path: '/',
    name: 'panel',
    meta: {
      title: 'Panel Home'
    },
    component: (resolve) => require(['./views/panel.vue'], resolve)
  },
  {
    path: '/article/',
    name: 'article_list',
    meta: {
      title: 'Article List'
    },
    component: (resolve) => require(['./views/article_list.vue'], resolve)
  }, {
    path: '/article/edit',
    name: 'article_edit',
    meta: {
      title: 'Article Edit'
    },
    component: (resolve) => require(['./views/article_edit.vue'], resolve)
  }, {
    path: '/settings/category',
    name: 'category',
    meta: {
      title: 'Category'
    },
    component: (resolve) => require(['./views/category.vue'], resolve)
  }
]

const RouterConfig = {
  base: ApiMap.common.prefix,
  mode: 'history',
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
