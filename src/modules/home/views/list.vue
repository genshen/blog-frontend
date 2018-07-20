<style scoped>

</style>
<template>
  <div class="container page-lists">

    <v-snackbar
      :timeout="snackbar_opotion.timeout"
      :color="snackbar_opotion.color"
      :multi-line="snackbar_opotion.multi_line"
      :vertical="snackbar_opotion.vertical"
      v-model="snackbar_opotion.show"
    >
      {{ snackbar_opotion.text }}
      <v-btn flat color="pink" @click.native="snackbar_opotion.show = false">Close</v-btn>
    </v-snackbar>

    <div class="row">
      <div v-for="blog in lists"  v-bind:key="blog.id" class="col-md-12 col-lg-10 col-lg-push-1">
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
import Util from '@/common/libs/utils/util'
import Net from '@/common/libs/net/net'

export default {
  data: function () {
    return {
      lists: [],
      snackbar_opotion: {
        show: false,
        color: '',
        multi_line: false,
        vertical: false,
        timeout: 6000,
        text: ''
      }
    }
  },
  methods: {
    handleStart () {
      this.$Modal.info({
        title: 'Bravo',
        content: 'Now, enjoy the convenience of iView.'
      })
    },
    snackbar (text) {
      this.snackbar_opotion.text = text
      this.snackbar_opotion.show = true
    }
  },
  mounted () {
  },
  created: function () {
    this.$Progress.start()
    let self = this
    Net.axiosInstance.get(ApiMap.list.category, { // todo different category
      params: {
        ID: 12345
      }
    })
      .then(function (response) {
        try {
          self.$Progress.finish()
          response.forEach(function (e) { // if it is not json?
            if (!e.cover) {
              e.cover = '/static/assets/imgs/brand.jpg'
            }
            self.lists.push(e)
          })
        } catch (err) {
          self.$Progress.fail()
          self.snackbar(Util.messages.SnackbarErrorMessage)
        }
      })
      .catch(function () {
        self.$Progress.fail()
        self.snackbar(Util.messages.SnackbarErrorMessage)
      })
  },
  route: {
    data: function () {
      window.console.log('data!@')
    }
  }
}
</script>
