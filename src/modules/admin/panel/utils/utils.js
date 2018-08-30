import ApiMap from './api_map'
import net from "@/common/libs/net/net";

let utils = {}

// container:Array, which includes those categories
utils.loadCategories = function (context, container) {
  net.axiosInstance.get(ApiMap.category.get, net.axios.load_admin_jwt_config())
    .then(function (response) {
      try {
        if (response) {
          response.forEach(function (e) {
            container.push(e)
          })
        }
      } catch (e) {
        $('body').snackbar({alive: 3000, content: '出了点错误,请重试'})
      }
    }).catch(() => {
    // console.log(err)
    $('body').snackbar({alive: 3000, content: '出了点错误,请重试'})
  })
}

export default utils
