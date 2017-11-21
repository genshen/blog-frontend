<style scoped>

</style>
<template>
  <div class="container page-lists">
    <div class="row">
      <div v-for="blog in lists" class="col-md-12 col-lg-10 col-lg-push-1">
        <div class="card">
          <div class="card-main">
            <div class="card-header">
              <div class="card-header-side pull-left">
                <span>{{blog.create_at | formatTime}}</span>
              </div>
              <div class="card-inner">
                <router-link :to="{name:'detail',params:{id:blog.id}}" class="card-heading">{{blog.title}}</router-link>
              </div>
            </div>
            <div class="card-img">
              <img alt="alt text" :src="blog.cover" style="width: 100%;">
              <!--<p class="card-img-heading"></p>-->
            </div>
            <div class="card-inner">
              <p>{{blog.summary}}</p>
            </div>
            <div class="card-action">
              <div class="card-action-btn pull-left">
                <router-link :to="{name:'detail',params:{id:blog.id}}"
                             class="btn btn-flat waves-effect waves-attach" href="javascript:void(0)">
                  <span class="icon">more_vert</span>&nbsp;Read More
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  <!--row-->
  </div>
</template>
<script>
  import ApiMap from '../api_map'
  import Util from '../../../common/libs/utils/util'

  export default {
    data: function () {
      return {
        lists: []
      }
    },
    methods: {
      handleStart () {
        this.$Modal.info({
          title: 'Bravo',
          content: 'Now, enjoy the convenience of iView.'
        })
      }
    },
    mounted () {

    },
    created: function () {
      this.$parent.$refs.topProgress.start()
      let self = this
      $.ajax({
        url: ApiMap.list.category, // todo different category
        success: function (data) { // if it is not json?
          try {
            self.$parent.$refs.topProgress.done()
            data.forEach(function (e) {
              if (!e.cover) {
                e.cover = '/static/assets/imgs/brand.jpg'
              }
              self.lists.push(e)
            })
          } catch (err) {
            self.$parent.$refs.topProgress.fail()
            Util.ui.snackbar({alive: 3000, content: Util.messages.NormalErrorSnackBar})
          }
        },
        error: function () {
          self.$parent.$refs.topProgress.fail()
          Util.ui.snackbar({alive: 3000, content: Util.messages.NormalErrorSnackBar})
        }
      })
    },
    route: {
      data: function () {
        window.console.log('data!@')
      }
    }
  }
</script>
