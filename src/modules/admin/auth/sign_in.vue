<style scoped>
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
  .ui-footer {
    border-top: 1px solid rgba(0, 0, 0, .12);
    text-align: center;
    margin-top: 6px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .login-form-container{
    width: 100%;
  }
  .ui-content {
    margin-top: 24px;
    margin-bottom: 92px;
  }
</style>
<template>
  <v-app id="login" class="indigo">
    <!--<progress-bar ref="topProgress"></progress-bar>-->
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

    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm6 md4 lg4>
            <v-card elevation-2 pa-4>
              <v-card-title primary-title>
                <div class="layout column align-center">
                  <!--<img src="/static/m.png" alt="Vue Material Admin" width="120" height="120">-->
                  <h1 class="flex my-4 primary--text">Login to Admin</h1>
                </div>
              </v-card-title>
              <v-card-text>
                <div class="login-form-container">
                  <v-form ref="form" v-model="form.valid" lazy-validation>
                    <v-text-field
                      append-icon="person"
                      v-model="form.email.value"
                      :rules="form.email.rules"
                      name="email"
                      label="E-mail"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="form.password.value"
                      :append-icon="form.password.visible ? 'visibility_off' : 'visibility'"
                      :append-icon-cb="() => (form.password.visible = !form.password.visible)"
                      :type="form.password.visible ? 'text' : 'password'"
                      :rules="form.password.rules"
                      name="password"
                      label="Enter your password"
                      hint="At least 6 characters"
                      min="6"
                      required
                      counter
                    ></v-text-field>
                  </v-form>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn flat :disabled="!form.valid" :loading="form.loading" @click="onSubmit" color="info">Submit
                </v-btn>
                <v-btn flat>Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <v-footer color="light" height="128" inset class="ui-footer footer">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <p>
              <a>关于</a>&nbsp;|
              <a target="_blank">Github</a>
            </p>
            <p class="powered">
              Powered by <a href="https://beego.me/" target="_blank">Beego Framework</a>
              <span>& UI by </span><a href="https://github.com/vuetifyjs/vuetify" target="_blank">Material of vuetifyjs</a>
            </p>
          </div>
        </div>
      </div>
    </v-footer>
  </v-app>

</template>

<script>
import UrlMap from './sign_in_url_map'
import Net from '@/common/libs/net/net'
import Util from '@/common/libs/utils/util'
import Config from '@/common/config/config'

export default {
  data () {
    return {
      snackbar_opotion: {
        show: false,
        color: '',
        multi_line: false,
        vertical: false,
        timeout: 6000,
        text: ''
      },
      form: {
        valid: false,
        loading: false,
        name: {
          value: '',
          rules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be less than 10 characters'
          ]
        },
        email: {
          value: '',
          rules: [
            v => !!v || 'E-mail is required',
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
          ]
        },
        password: {
          value: '',
          visible: false,
          rules: [
            v => !!v || 'Password is required',
            v => (v && v.length >= 6) || 'Password must be more than 6 characters'
          ]
        }
      }
    }
  },
  methods: {
    snackbar (text) {
      this.snackbar_opotion.text = text
      this.snackbar_opotion.show = true
    },
    onSubmit: function () {
      //  Util.network.postData.config.authUrl = location.pathname
      this.form.loading = true
      Net.apiPost(UrlMap.auth_url, {
        email: this.form.email.value,
        password: this.form.password.value
      }, (data) => { // on success
        sessionStorage.setItem(Config.jwt.jwt_session_name_admin, data.addition.jwt_token)
        window.location.replace(data.addition.next + '?' + Config.jwt.jwt_koten_request_name + '=' + data.addition.jwt_token)
      }, (e) => { // on error
        this.snackbar(Util.messages.SnackbarErrorMessage)
      }, (error) => { // on response error
        console.log(error)
        for (let key in error) {
          let message = error[key]
          this.snackbar(message)
          return
        }
      }, null, (code, message) => {
        this.form.loading = false
      })
    }
  }
}
</script>
