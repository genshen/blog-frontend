<style scoped>
  .page-brand .ui-header {
    background-color: #3f51b5
  }

  .nav-search-box {
    margin: 0 16px;
  }

  .nav-search-box .form-group {
    margin-top: 8px;
    margin-bottom: 6px
  }

  .ui-main-content {
    margin-top: 55px;
    margin-bottom: 110px; /*102+8*/
  }

  .ui-footer {
    border-top: 1px solid rgba(0, 0, 0, .12);
    text-align: center;
    padding-top: 12px;
    padding-bottom: 12px;
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
  <div class="layout page-brand">
    <top-progress ref="topProgress"></top-progress>

    <header class="header header-transparent header-waterfall ui-header">
      <ul class="nav nav-list pull-left">
        <li>
          <a data-toggle="menu" href="#ui_menu">
            <span class="icon icon-lg">menu</span>
          </a>
        </li>
      </ul>
      <router-link v-if="settings" class="header-logo header-affix-hide margin-left-no margin-right-no"
                   data-offset-top="213"
                   data-spy="affix" :to="{ name:'home'}">{{settings.site_info.name}}
      </router-link>
      <ul class="nav nav-list pull-right">
        <template v-if="categories">
          <li v-for="category in categories" v-if="category.sub_category.length != 0 "
              class="dropdown margin-right hidden-xx hidden-xs">
            <a class="dropdown-toggle text-black waves-attach waves-effect"
               data-toggle="dropdown" aria-expanded="false">
              <span>{{category.name}}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-right">
              <li v-for="sub in category.sub_category">
                <router-link :to="{name:'category',params:{menu:category.slug,sub_menu:sub.slug}}"
                             class="padding-right-lg waves-attach waves-effect">{{sub.name}}
                </router-link>
              </li><!--<span class="icon icon-lg margin-right waves-effect">account_box</span>-->
            </ul>
          </li>
        </template>
        <li>
          <a data-toggle="menu" href="#ui_menu_profile">
            <span v-if="settings" class="access-hide">{{settings.site_info.url}}</span>
            <span class="avatar avatar-sm">
                     <img v-if="settings" :alt="settings.profile.name" :src="settings.profile.avatar">
                </span>
          </a>
        </li>
      </ul>
    </header>

    <nav aria-hidden="true" tabindex="-1" class="menu " id="ui_menu">
      <div class="menu-scroll">
        <div class="menu-content">
          <router-link v-if="settings" class="menu-logo" :to="{name: 'home'}">{{settings.site_info.name}}
          </router-link>
          <ul class="nav">
            <li class="nav-search-box">
              <div class="form-group form-group-label">
                <label class="floating-label" for="search">search</label>
                <input class="form-control" id="search" type="text">
              </div>
            </li>
            <template v-if="categories">
              <li v-for="(category,index) in categories" v-if="category.sub_category.length != 0">
                <a class="collapsed waves-attach waves-effect" :href="'#ui_menu_'+index"
                   data-toggle="collapse">{{category.name}}</a>
                <ul class="menu-collapse collapse" :id="'ui_menu_'+index">
                  <li v-for="sub in category.sub_category">
                    <router-link
                      :to="{name:'category',params:{menu:category.slug,sub_menu:sub.slug}}"
                      class="waves-attach waves-effect">{{sub.name}}
                    </router-link>
                  </li>
                </ul>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <nav aria-hidden="true" class="menu menu-right" id="ui_menu_profile" tabindex="-1">
      <div class="menu-scroll">
        <div class="menu-top">
          <div class="menu-top-img">
            <img alt="landscape" src="/static/assets/imgs/landscape.jpg">
          </div>
          <div class="menu-top-info">
            <a class="menu-top-user" href="javascript:void(0)">
              <span class="avatar avatar-inline margin-right">
                <img v-if="settings" alt="Avatar" :src="settings.profile.avatar">
              </span>
              <span v-if="settings">{{settings.profile.name}}</span>
            </a>
          </div>
          <div class="menu-top-info-sub">
            <small v-if="settings">{{settings.profile.bio}}</small>
          </div>
        </div>
        <div class="menu-content">
          <ul class="nav">
            <li>
              <a class="waves-attach waves-effect" href="javascript:void(0)">
                Profile Settings
                <span class="menu-collapse-toggle collapsed waves-attach waves-effect"
                      data-target="#ui_menu_profile_settings" data-toggle="collapse">
								<div class="menu-collapse-toggle-close">
									<i class="icon icon-lg">close</i>
								</div>
								<div class="menu-collapse-toggle-default">
									<i class="icon icon-lg">add</i>
								</div>
							</span>
              </a>
              <ul class="menu-collapse collapse" id="ui_menu_profile_settings">
                <li>
                  <a class="waves-attach waves-effect" href="javascript:void(0)">First Item</a>
                </li>
                <li>
                  <a class="waves-attach waves-effect" href="javascript:void(0)">Another Item</a>
                </li>
                <li>
                  <a class="waves-attach waves-effect" href="javascript:void(0)">Something Else</a>
                </li>
              </ul>
            </li>
            <li>
              <a class="waves-attach waves-effect" href="javascript:void(0)">Upload Photo</a>
            </li>
            <li>
              <a class="waves-attach waves-effect" href="javascript:void(0)">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div aria-hidden="true" class="modal modal-va-middle fade" id="auth_model" role="dialog" tabindex="-1">
      <div class="modal-dialog modal-xs">
        <div class="modal-content">
          <div class="modal-heading">
            <h2 class="modal-title">登录认证后才能添加评论</h2>
          </div>
          <ul class="nav">
            <li>
              <a @click="openGithub" href="javascript:void(0)"
                 class="margin-bottom-sm waves-attach waves-effect">
                <svg aria-hidden="true" class="octicon octicon-mark-github" height="24" version="1.1"
                     viewBox="0 0 16 16" width="24">
                  <path
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                <span class="margin-right-sm text-black">&emsp;Github登录</span>
              </a>
            </li>
          </ul>
          <div class="modal-footer">
            <p class="text-right">
              <a class="btn btn-flat btn-brand-accent waves-attach waves-effect"
                 data-dismiss="modal">取消</a>
            </p>
          </div>
        </div>
      </div>
    </div><!--model-->

    <main class="ui-main-content">
      <router-view v-bind:settings="settings"></router-view>
    </main>

    <footer class="ui-footer footer">
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
    </footer>

    <div class="fbtn-container">
      <div class="fbtn-inner">
        <a class="fbtn fbtn-lg fbtn-brand-accent waves-attach waves-effect waves-circle waves-light"
           data-toggle="dropdown"><span
          class="fbtn-text fbtn-text-left">Links</span><span class="fbtn-ori icon">apps</span><span
          class="fbtn-sub icon">close</span></a>
        <div class="fbtn-dropup">
          <a class="fbtn waves-attach waves-effect waves-circle" href="https://github.com/genshen"
             target="_blank">
            <span class="fbtn-text fbtn-text-left">Fork Me On Github</span><span
            class="icon">code</span></a>
          <a class="fbtn fbtn-brand waves-attach waves-effect waves-circlet" href="https://github.com/genshen"
             target="_blank">
            <span class="fbtn-text fbtn-text-left">My Works</span><span
            class="icon">all_inclusive</span></a>
          <a class="fbtn fbtn-green waves-attach waves-effect waves-circle" href="https://gensh.me/"
             target="_blank">
            <span class="fbtn-text fbtn-text-left">Visit My Website</span><span class="icon">link</span></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import TopProgress from 'vue-top-progress'
  import ApiMap from './api_map'
  import Util from '../../common/libs/utils/util'

  export default {
    data () {
      return {
        settings: null,
        categories: null
      }
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

    },
    components: {
      TopProgress
    }
  }
</script>
