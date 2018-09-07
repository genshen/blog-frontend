import ApiMap from './api_map'
import net from '@/common/libs/net/net'

const utils = {}

// container:Array, which includes those categories
utils.loadCategories = function (context, container) {
  net.axiosInstance.get(ApiMap.category.get)
    .then((response) => {
      try {
        if (response) {
          response.data.forEach((e) => {
            container.push(e)
          })
        }
      } catch (e) {
        context.snackbar('出了点错误,请重试')
      }
    }).catch(() => { // todo un auth.
    // console.log(err)
      context.snackbar('出了点错误,请重试')
    })
}

export default utils
