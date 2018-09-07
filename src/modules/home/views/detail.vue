<style scoped>
  .blog-detail-mate {
    margin-top: 16px;
  }

  .blog-detail-mate .article-title {
    font-weight: 500;
  }
  .blog-detail-mate a {
    /*color:#50596c;*/
    text-decoration: none;
    text-shadow: 1px 1px 4px #eee;
  }

  .blog-article:after, .blog-detail-mate:after {
    margin-top: 16px;
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    box-sizing: content-box;
    display: block;
    height: 0;
  }

  .inline-avatar {
    display: inline-block;
  }

  .blog-detail-mate .refer-me {
    font-family: Georgia, "Times New Roman", Times, serif;
  }

</style>

<template>
  <v-container  full-height>
    <v-layout row justify-center>
      <v-dialog v-model="dialogs.auth" persistent max-width="360">
        <v-card>
          <v-card-title class="headline">{{$t('auth.auth_dialog_title')}}</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-tile avatar @click="openForAuth(settings.auth_sites.github)">
                <v-list-tile-avatar>
                  <img src="@/assets/github.svg"/>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="title">Github</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click.native="dialogs.auth = false">{{$t("auth.auth_dialog_cancel")}}</v-btn>
            <v-btn color="green darken-1" flat @click.native="dialogs.auth = false">{{$t("auth.auth_dialog_ok")}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 class="blog-detail-mate">
        <p class="display-1 blue-grey--text article-title">{{article.title}}</p>
        <div>
          <a :href="settings.profile.url" target="_blank">
            <v-avatar color="grey lighten-4">
              <img alt="Avatar" :src="settings.profile.avatar">
            </v-avatar>
            <span class="refer-me">&nbsp;By {{settings.profile.name}}</span>
            &nbsp;·&nbsp;<span class="grey--text text--lighten-1" :title="article.created_at">{{article.created_at | formatTime}}</span>
          </a>
        </div>
      </v-flex>
    </v-layout>

    <v-layout row my-3>
      <v-flex xs12>
        <v-card flat>
          <v-card-text class="blog-article">
            <article>
              <Markdown :marked="article.content"></Markdown>
            </article>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <Comment
      :lazy_loading="true"
      :post_id="article.id"
      :comments_count="article.comment_count"
      :reply_count="article.reply_count"
      :comment_add_url="comment_add_url"
      :reply_add_url="reply_add_url"
      v-on:on-un-auth="onUnAuth"
    >
    </Comment>
  </v-container>
</template>
<script>
import Markdown from '@/common/components/markdown'
// import Config from '@/common/config/config'
import {OnAuth} from '../store/mulations_type'
import ApiMap from '../api_map'
import Util from '@/common/libs/utils/util'
import net from '@/common/libs/net/net'
import Comment from "./comp_post_comment"

export default {
  data: function () {
    return {
      article: {
        id: '',
        title: '',
        content: '',
        summary: '',
        cover: '',
        view_count: 0,
        comment_count: 0,
        reply_count: 0,
        created_at: '',
        updated_at: ''
      },
      dialogs:{
        auth: false
      }
    }
  },
  computed: {
    settings() {
      return this.$store.state
    },
    comment_add_url() {
      return ApiMap.detail.commentAdd
    },
    reply_add_url() {
      return ApiMap.detail.replyAdd
    }
  },
  components: {
    Markdown, Comment
  },
  methods: {
    // open auth dialog.
    onUnAuth() {
      this.dialogs.auth = true
    },
    openForAuth(auth_site){
      if (!auth_site) {
        this.$snackbar(this.$t('auth.fail_open_auth_site'))
        return
      }
      let url = auth_site.url + auth_site.client_id
      window.open(url, '', 'location=no,status=no')
    },
    onOAuth2Passed(event) { // oauth2 callback post message
      if (event.origin === location.origin) {
        if (event.data.status === 1) { // ok
          this.$store.commit(OnAuth, event.data.addition) // set on-auth and save jwt to localStorage.
          this.$snackbar(this.$t('auth.message_auth_success'))
          // close dialog
          this.dialogs.auth = false
          return
        }
        //else{
        // in dev mode, some webSocket message will reach this branch.
        // if(!Config.isDevMode()) {
        //   this.$snackbar(this.$t('auth.callback_message_error'))
        // }
       // }
      }
    }
  },
  mounted () {
    window.addEventListener('message', this.onOAuth2Passed)
  },
  beforeDestroy () {
    window.removeEventListener('message', this.onOAuth2Passed)
  },
  created () {
    net.axiosInstance.get(ApiMap.detail.content(this.$route.params.id))
      .then((response) => { // what if it is not json?
        let data = response.data
        try {
          if (!data.id) {
           this.$snackbar(this.$t('post.detail.article_not_found'))
            return
          }
          if (!data.cover) {
            data.cover = '/static/assets/img/brand.jpg' // todo image name
          }
          this.article = data
        } catch (err) {
          this.$snackbar(Util.messages.NormalErrorSnackBar)
        }
      }).catch(() => {
      this.$snackbar(Util.messages.NormalErrorSnackBar)
    })
  }
}
</script>
