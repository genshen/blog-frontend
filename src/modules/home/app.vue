<style scoped>
  /*top image*/
  .top-landscape {
    background-color: #000;
    height: 144px;
    position: relative;
  }

  .drawer-img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    justify-content: center;
    overflow: hidden;
  }

  .drawer-img img {
    min-height: 100%;
    width: 100%;
    opacity: .5
  }

  /*image avatar*/
  .drawer-avatar {
    /*padding: 12px 16px;*/
    padding: 24px 16px;
    position: relative;
  }

  .drawer-avatar a {
    text-decoration: none;
  }

  .drawer-avatar .name {
    color: white;
    margin-left: 8px;
  }

  .drawer-bio {
    margin: 0 12px;
    color: white;
    position: absolute;
    bottom: 12px; /*align to bottom (12px)*/
  }

  /* @media only screen and (min-width: 768px) {
    .drawer-avatar {
      padding-top: 24px;
      padding-bottom: 24px;
    }
  }
*/
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
    <v-navigation-drawer width="320" v-model="drawer" light floating app>
      <v-layout row wrap>
        <v-flex xs12 class="top-landscape">
          <div class="drawer-img">
            <img src="@/assets/landscape.jpg"/>
          </div>
          <div class="drawer-avatar">
            <a :href="settings.profile.url" target="_blank">
              <v-avatar v-if="settings.profile.avatar">
                <img :src="settings.profile.avatar" alt="John">
              </v-avatar>
              <v-avatar v-else color="indigo">
                <v-icon dark>account_circle</v-icon>
              </v-avatar>
              <span class="name">{{settings.profile.name}}</span>
            </a>
          </div>
          <div class="drawer-bio">
            <small>{{settings.profile.bio}}</small>
          </div>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>

    <v-toolbar color="primary" scroll-off-screen dark app> <!--elevation-0-->
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Application</v-toolbar-title>
      <!--<v-toolbar-title slot="extension" class="white&#45;&#45;text">Title</v-toolbar-title>-->
    </v-toolbar>
    <!--<progress-bar ref="topProgress"></progress-bar>-->

    <v-content>
      <router-view class="ui-main-content"></router-view>
    </v-content>

    <v-footer color="light" height="128" class="ui-footer footer">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <p>
              <a>关于</a>&nbsp;|
              <a v-if="settings.site_info.source_code" :href="settings.site_info.source_code" target="_blank">Github</a>
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
import {StateInit, UpdateAllState} from './store/mulations_type'
import net from '@/common/libs/net/net'

export default {
  data () {
    return {
      drawer: true
    }
  },
  computed: {
    settings () {
      return this.$store.state
    }
  },
  components: {
    ProgressBar
  },
  methods:{},
  mounted() {
    this.$store.commit(StateInit)
  },
  created () {
    net.axiosInstance.get(ApiMap.app.settings)
      .then((response) => {
        if(response && response.data){
          this.$store.commit(UpdateAllState, response.data)
        }
    })
  }
}
</script>
