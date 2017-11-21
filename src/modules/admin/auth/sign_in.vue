<style scoped>
  .ui-footer {
    border-top: 1px solid rgba(0, 0, 0, .12);
    text-align: center;
    margin-top: 6px;
    padding-top: 12px;
    padding-bottom: 12px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .ui-content {
    margin-top: 24px;
    margin-bottom: 92px;
  }
</style>
<template>
  <div class="layout page-brand">
    <top-progress ref="topProgress"></top-progress>
    <header class="header header-brand  ui-header">
      <span class="header-logo">Admin</span>
    </header>

    <main id="app" class="ui-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-lg-push-4 col-sm-6 col-sm-push-3">
            <section>
              <div class="card">
                <div class="card-main">
                  <div class="card-header">
                    <div class="card-inner">
                      <h1 class="card-heading">Sign In</h1>
                    </div>
                  </div>
                  <div class="card-inner">
                    <p class="text-center">
                      <span class="avatar avatar-inline avatar-lg">
                        <img alt="Login" src="/static/assets/imgs/avatar.jpg">
                      </span>
                    </p>
                    <div class="form-group form-group-label">
                      <div class="row">
                        <div class="col-md-10 col-md-push-1">
                          <label class="floating-label" for="sign_in_email">Email</label>
                          <input v-model="email" class="form-control" id="sign_in_email" type="text">
                        </div>
                      </div>
                    </div>
                    <div class="form-group form-group-label">
                      <div class="row">
                        <div class="col-md-10 col-md-push-1">
                          <label class="floating-label" for="sign_in_password">Password</label>
                          <input v-model="password" class="form-control" id="sign_in_password"
                                 type="password">
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="row">
                        <div class="col-md-10 col-md-push-1">
                          <button @click="onSubmit" class="btn btn-block btn-brand waves-attach">
                            SignIn
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="row">
                        <div class="col-md-10 col-md-push-1">
                          <div class="checkbox checkbox-adv">
                            <label for="ui_login_remember">
                              <input class="access-hide" id="ui_login_remember"
                                     name="ui_login_remember" type="checkbox">Stay signed in
                              <span class="checkbox-circle"></span>
                              <span class="checkbox-circle-check"></span>
                              <span class="checkbox-circle-icon icon">done</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> <!---card-inner-->
                </div><!---card-main-->
              </div><!--card-->
              <div class="clearfix">
                <p class="margin-no-top pull-left">
                  <a class="btn btn-flat btn-brand waves-attach" href="javascript:void(0)">Need help?</a>
                </p>
                <p class="margin-no-top pull-right">
                  <a class="btn btn-flat btn-brand waves-attach" href="javascript:void(0)">Create an account</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer ui-footer">
      <div class="container">
        <p>Material</p>
      </div>
    </footer>
  </div>

</template>

<script>
  import TopProgress from 'vue-top-progress'
  import UrlMap from './sign_in_url_map'
  import Util from '../../../common/libs/utils/util'

  export default {
    data () {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      onSubmit: function () {
        if (!this.email) {
          $('body').snackbar({alive: 3500, content: '邮箱不能为空'})
        } else if (!this.password) {
          $('body').snackbar({alive: 3500, content: '密码不能为空'})
        } else {
          //  Util.network.postData.config.authUrl = location.pathname
          Util.network.postData.init(UrlMap.auth_url, {
            email: this.email,
            password: this.password
          }, null, function (data) {
            window.location.replace(data.Addition)
          })
        } // else end
      }
    },
    components: {
      TopProgress
    }
  }
</script>
