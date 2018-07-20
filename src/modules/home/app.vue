<style scoped>
  .ui-main-content {
    padding-bottom: 120px
  }

  .ui-footer {
    border-top: 1px solid rgba(0, 0, 0, .12);
    text-align: center;
  }

  .ui-footer .powered {
    margin-top: -8px;
  }
</style>
<template>
  <v-app id="inspire">
    <v-navigation-drawer width="400" light fixed v-model="drawer" app>
      <v-layout row wrap text-xs-center style="padding-top:48%;">
        <v-flex xs12>
          <v-avatar size="64" color="red">
            <span class="white--text headline">G</span>
          </v-avatar>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>

    <v-toolbar color="white" app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-toolbar>
    <!--<progress-bar ref="topProgress"></progress-bar>-->

    <v-content>
      <v-container fluid fill-height class="ui-main-content">
        <router-view v-bind:settings="settings"></router-view>
      </v-container>
    </v-content>

    <v-footer color="indigo" height="128" inset class="ui-footer footer">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <p>
              <a>关于</a>&nbsp;|
              <a v-if="settings" :href="settings.site_info.source_code" target="_blank">Github</a>
            </p>
            <p class="powered">
              Powered by <a href="https://beego.me/" target="_blank">Beego Framework</a>
              <span>& UI by </span><a href="https://github.com/Daemonite/material" target="_blank">Material</a>
            </p>
          </div>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>
<script>
import ProgressBar from 'vue-progressbar'
import ApiMap from './api_map'
import Util from '@/common/libs/utils/util'

export default {
  data () {
    return {
      drawer: true,
      settings: null,
      categories: null
    }
  },
  components: {
    ProgressBar
  },
  created () {
    let self = this
    $.get(ApiMap.app.settings, function (data) {
      self.settings = data.settings
      self.categories = data.categories
      self.settings.is_auth = data.is_auth
      if (data.user) {
        self.settings.user = data.user
      }
    })
  },
  mounted () {
    let self = this
    window.addEventListener('message', function (e) {
      if (e.origin === location.origin) {
        let data = e.data
        if (data.status === 1) {
          self.settings.is_auth = true
          self.settings.user = data
          Util.ui.snackbar({alive: 3000, content: '登录认证成功'})
        }
      }
    })
  },
  methods: {
    openGithub () {
      let url = this.settings.auth_sites.github.url + this.settings.auth_sites.github.client_id
      window.open(url, '', 'location=no,status=no')
      $('#auth_model').modal('hide')
    }
  },
  beforeDestroy () {
  }
}
</script>
