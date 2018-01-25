<style scoped>
  .ui-main-content {
    margin-top: 55px;
    margin-bottom: 50px; /*102+8*/
  }

  .ui-footer {
    border-top: 1px solid rgba(0, 0, 0, .12);
    text-align: center;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .ui-footer .powered {
    margin-top: -8px;
  }
</style>
<template>
    <v-app id="inspire">
      <v-navigation-drawer fixed v-model="drawer" app>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>contact_mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Contact</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Application</v-toolbar-title>
      </v-toolbar>

      <v-content>
        <v-container fluid fill-height>
          <top-progress ref="topProgress"></top-progress>
          <router-view v-bind:settings="settings"></router-view>
        </v-container>
      </v-content>

      <v-footer color="indigo" app class="ui-footer footer">
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

    <!--<div class="fbtn-container">-->
      <!--<div class="fbtn-inner">-->
        <!--<a class="fbtn fbtn-lg fbtn-brand-accent waves-attach waves-effect waves-circle waves-light"-->
           <!--data-toggle="dropdown"><span-->
          <!--class="fbtn-text fbtn-text-left">Links</span><span class="fbtn-ori icon">apps</span><span-->
          <!--class="fbtn-sub icon">close</span></a>-->
        <!--<div class="fbtn-dropup">-->
          <!--<a class="fbtn waves-attach waves-effect waves-circle" href="https://github.com/genshen"-->
             <!--target="_blank">-->
            <!--<span class="fbtn-text fbtn-text-left">Fork Me On Github</span><span-->
            <!--class="icon">code</span></a>-->
          <!--<a class="fbtn fbtn-brand waves-attach waves-effect waves-circlet" href="https://github.com/genshen"-->
             <!--target="_blank">-->
            <!--<span class="fbtn-text fbtn-text-left">My Works</span><span-->
            <!--class="icon">all_inclusive</span></a>-->
          <!--<a class="fbtn fbtn-green waves-attach waves-effect waves-circle" href="https://gensh.me/"-->
             <!--target="_blank">-->
            <!--<span class="fbtn-text fbtn-text-left">Visit My Website</span><span class="icon">link</span></a>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
</template>
<script>
import TopProgress from 'vue-top-progress'
import ApiMap from './api_map'
import Util from '../../common/libs/utils/util'

export default {
  data () {
    return {
      drawer: true,
      settings: null,
      categories: null
    }
  },
  created () {
    console.log(this.$vueTopprogress)
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
  },
  components: {
    topProgress: TopProgress
  }
}
</script>
