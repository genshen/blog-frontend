import ApiMap from './api_map'

let utils = {}

// container:Array, which includes those categories
utils.loadCategories = function (context, container) {
  $.ajax({
    url: ApiMap.settings.categories,
    success: function (data) {
      try {
        if (data) {
          data.forEach(function (e) {
            container.push(e)
          })
        }
      } catch (e) {
        $('body').snackbar({alive: 3000, content: '出了点错误,请重试'})
      }
    },
    error: function () {
      // console.log(err)
      $('body').snackbar({alive: 3000, content: '出了点错误,请重试'})
    }
  })
}

export default utils
