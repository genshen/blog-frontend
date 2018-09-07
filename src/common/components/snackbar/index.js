/**
 * Vue SnackBar based on vuetify.
 * copy and modified from https://github.com/eolant/vuetify-toast-snackbar
 */
import Snackbar from './snackbar.vue'

function init (Vue, options = {}) {
  let cmp = null
  const property = options.property || '$snackbar'

  function createCmp (options) {
    cmp = new Vue(Snackbar)
    Object.assign(cmp, Vue.prototype[property].options, options)
    document.body.appendChild(cmp.$mount().$el)
  }

  function show (message, options = {}) {
    if (cmp) {
      cmp.close()
      Vue.nextTick(() => {
        cmp = null
        show(message, options)
      })
      return
    }

    options.message = message
    return createCmp(options)
  }

  function shorts (options) {
    const colors = ['success', 'info', 'error', 'warning']
    const methods = {}

    colors.forEach((color) => {
      methods[color] = (message, options) => show(message, { color, ...options })
    })
    if (options.shorts) {
      for (const key in options.shorts) {
        const localOptions = options.shorts[key]
        methods[key] = (message, options) => show(message, { ...localOptions, ...options })
      }
    }

    return methods
  }

  Vue.prototype[property] = Object.assign(show, {
    options,
    ...shorts(options)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(init)
}

export default init
