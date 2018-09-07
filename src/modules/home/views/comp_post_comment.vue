<style scoped>
  .comment-area .comment-form {
    margin-top: 20px;
    margin-bottom: 6px
  }

  .comment-item {
    padding-top: 6px;
    padding-bottom: 6px;
  }

  .comment-item.comments-border {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }

  .comment-mate .user-refer {
    font-family: Georgia, "Times New Roman", Times, serif;
  }

  .comment-content {
    padding-left: 40px;
  }

  .reply-area {
    padding-left: 56px; /*40+16 */
    padding-right: 10px; /*10 + 6 = 16*/
  }

  .reply-area .reply-item {
    padding: 4px 6px 4px 6px; /*10 + 6(2nd) = 16*/
    border: solid transparent 1px;
  }

  .reply-area .reply-item:hover {
    border: dashed rgba(0, 0, 0, 0.12) 1px;
  }

  .reply-refer span {
    vertical-align: super;
  }

  .reply-refer:hover {
    text-decoration: none;
  }

  .reply-area .reply-content {
    padding-left: 40px;
  }

  .reply-box-form {
    margin-top: 20px;
    margin-bottom: 6px
  }

  .reply-box-form textarea {
    resize: none;
  }
</style>

<template>
  <v-layout row wrap mt-5>
    <v-flex xs12>
      <p class="col-md-12"><b>{{comments.length}}条评论</b></p>
    </v-flex>
    <v-flex xs12>
      <v-textarea id="comment-input" rows="4" box
                  v-model="comment_text"
                  hint="支持Markdown输入"
                  label="你的评论"
                  prepend-inner-icon="add_comment">
      </v-textarea>
      <div class="text-xs-right">
        <v-btn title="预览" flat icon color="primary">
          <v-icon>visibility</v-icon>
        </v-btn>
        <v-btn depressed @click="submitComment" color="primary">
          发布
          <v-icon light>publish</v-icon>
        </v-btn>
      </div>
    </v-flex>

    <v-flex xs12 class="comment-area">
      <div id="comment-flag" style="height:8px"></div>
      <div v-for="(comment,comment_index) in comments" v-bind:key="comment_index"
           :class="{'comments-border':comment_index != 0}" class="col-md-12 comment-item">
        <div class="comment-mate">
          <span class="avatar inline-avatar">
            <a :href="comment.user.url" target="_blank"><img alt="Avatar" :src="comment.user.avatar"></a>
          </span>
          <span class="user-refer"><a :href="comment.user.url" target="_blank">{{comment.user.name}}</a>&nbsp;</span>
          <span class="label label-brand" :title="comment.create_at">{{comment.create_at | formatTime}}</span>
          <a @click="toggleReplyBox(comment_index,-1)" href="javascript:void(0)"
             class="pull-right reply-refer"><i class="icon icon-2x">reply</i><span>回复</span>
          </a>
        </div>
        <div class="comment-content">{{comment.content}}</div>

        <div class="reply-area row">
          <div v-for="(reply,reply_index) in comment.replies" v-bind:key="reply_index"
               class="clo-md-12 reply-item">
            <div class="comment-mate">
                <span class="avatar inline-avatar">
                  <a :href="reply.user.url" target="_blank"><img alt="Avatar" :src="reply.user.avatar"></a>
                </span>
              <span class="user-refer"><a :href="reply.user.url" target="_blank">{{reply.user.name}}</a>&nbsp;</span>
              <span class="label label-brand" :title="reply.create_at">{{reply.create_at | formatTime}}</span>
              <a @click="toggleReplyBox(comment_index,reply_index)" href="javascript:void(0)"
                 class="pull-right reply-refer">
                <i class="icon icon-2x">reply</i><span>回复</span>
              </a>
            </div>
            <div class="reply-content">{{reply.content}}</div>
          </div>
          <div v-show="comment.show_reply_box" class="form-group form-group-label reply-box-form">
            <label class="floating-label" :for="'reply-box-'+comment_index">回复</label>
            <textarea v-model="comment.new_reply_content" class="form-control"
                      :id="'reply-box-'+comment_index" rows="3"></textarea>
            <div class="pull-right">
              <a @click="cancelReply(comment_index)" title="取消"
                 class="btn btn-flat btn-brand waves-attach waves-effect">
                <i class="icon icon-lg">clear</i>
              </a>
              <a @click="submitReply(comment_index)"
                 class="btn btn-brand waves-attach waves-effect">回复</a>
            </div>
          </div>
        </div> <!---/reply-area-->
      </div> <!--/comment-item-->

      <div class="detail-container">
        <div class="container">
          <div class="row"> <!--row1 start-->
            <div class="col-md-12 col-lg-10 col-lg-push-1">
              <!--Html here-->
            </div>
          </div> <!--row end-->
        </div>
      </div>

    </v-flex>

    <v-flex>
      <CommentLoadStatus :load="loadComment" :status="comment_load_status"></CommentLoadStatus>
    </v-flex>
  </v-layout>
</template>

<script>
  import ApiMap from '../api_map'
  import {OnUnAuth} from '../store/mulations_type'
  import * as CC from './comment_config'
  import CommentLoadStatus from './comp_comment_load_status'
  import Util from '@/common/libs/utils/util'
  import net from '@/common/libs/net/net'

  export default {
    name: "post_comment",
    data() {
      return {
        comments: [],
        comments_loaded_count: 0,
        comment_load_status: CC.COM_STATUS_UNINIT,
        comment_text: ''
      }
    },
    props: {
      lazy_loading: {
        type: Boolean,
        default: false,
      },
      post_id: {
        required: true,
        type: String,
      },
      comments_count: {
        type: Number,
        default: 0,
      },
      reply_count: {
        type: Number,
        default: 0,
      },
      comment_add_url: {
        required: true,
        type: String,
      },
      reply_add_url: {
        required: true,
        type: String,
      }
    },
    components: {
      CommentLoadStatus
    },
    watch: {
      // if post id changed (the post id have initialized)
      post_id(new_id) {
        if (new_id) {
          this.loadComment()
        }
      }
    },
    computed: {
      is_auth() {
        return this.$store.state.is_oauth2_passed
      },
      oauth2_jwt() {
        return this.$store.state.oauth2_jwt
      },
      user() {
        return this.$store.state.user // including avatar_url, html_url, email, name.
      }
    },
    methods: {
      onMessage(message) {
        this.$snackbar(message)
      },
      tryJwtFailed() {
        this.$store.commit(OnUnAuth)  // clear localStorage data and reset {is_oauth2_passed} state to false.
        this.$snackbar(this.$t('auth.snackbar_comment_or_reply_auth_needed')) // show snackbar message
        this.$emit('on-un-auth') // open auth dialog.
      },
      lazyLoadComment() {
        if (document.getElementById('comment-flag').offsetTop < document.documentElement.clientHeight) {
          this.loadComment()
        } else {
          let self = this
          $(window).scroll(function () {
            if (document.getElementById('comment-flag').offsetTop - document.body.scrollTop <
              document.documentElement.clientHeight) {
              $(window).unbind('scroll')
              self.loadComment()
            }
          })
        }
      },
      loadComment() {
        if (this.comment_load_status === CC.COM_STATUS_INIT_LOADING || this.comment_load_status === CC.COM_STATUS_LOADING) {
          return
        }
        let start = this.comments_loaded_count
        this.comment_load_status = (start === 0 ? CC.COM_STATUS_INIT_LOADING : CC.COM_STATUS_LOADING)
        net.axiosInstance.get(ApiMap.detail.comments(this.post_id, start)) // todo generating url
          .then((response) => {
            try {
              if (!(response && response.data)) {
                this.onMessage(this.$t('post.comment.error_load_fail')) // todo data error and snackbar and error text.
                return
              }
              let data = response.data
              data.forEach((e) => {
                if (!this.containsComment(e.id)) { // todo array sort.
                  e.show_reply_box = false
                  e.new_reply_content = ''
                  this.comments.push(e)
                }
              })
              this.comments_loaded_count += data.length
              this.comment_load_status = (data.length === CC.maxCommentLength ?
                CC.COM_STATUS_INIT_LOADED_HAS_MORE : CC.COM_STATUS_INIT_LOADED_NO_MORE) // 2(has more) or 3(not more)
            } catch (err) {
              this.onMessage(this.$t('post.comment.error_load_fail'))
              this.comment_load_status = (start === 0 ? CC.COM_STATUS_INIT_FAIL : CC.COM_STATUS_LOAD_FAIL)
            }
          })
          .catch(() => {
            this.onMessage(this.$t('post.comment.error_load_fail'))
            this.comment_load_status = (start === 0 ? CC.COM_STATUS_INIT_FAIL : CC.COM_STATUS_LOAD_FAIL)
          })
      },
      containsComment(id) { // todo maybe not sort by id.
        let h = this.comments.length - 1
        let l = 0
        while (l <= h) {
          let m = Math.floor((h + l) / 2)
          if (this.comments[m].id === id) {
            return true
          }
          if (id > this.comments[m].id) {
            l = m + 1
          } else {
            h = m - 1
          }
        }
        return false
      },
      submitComment: function () {
        if (this.comment_text === '') {
          this.onMessage('评论内容不能为空')
          return
        }
        if (!this.is_auth) {
          this.$emit('on-un-auth')
          return
        }

        net.apiPost(this.comment_add_url, {
            post_id: this.post_id,
            content: this.comment_text
          }, {
            headers: {"Authorization": "Bearer " + this.oauth2_jwt}
          }, (data) => { // success
            this.comments.unshift({
              content: this.comment_text,
              create_at: (new Date()).getTime(),
              id: data.addition,
              replies: [],
              status: 1,
              user: this.user,   // fixme
              show_reply_box: false,
              new_reply_content: ''
            })
            this.comment_text = ''
            this.onMessage(this.$t('post.comment.adding_comment_success'))
          }, () => { // on error
            this.onMessage(this.$t('post.comment.error_adding_comment'))
          }, (error) => { // on response error
            this.onMessage(error) // error is just error message.
          }, () => { // on un_auth
            this.tryJwtFailed()
          }
        )
      },
      submitReply: function (commentIndex) {
        let commentSelf = this.comments[commentIndex]
        if (commentSelf.new_reply_content === '') {
          this.onMessage('回复内容不能为空')
          return
        }
        if (!this.settings.is_auth) {
          $('#auth_model').modal('show')
          return
        }
        let self = this
        Util.network.postData.init(this.reply_add_url, {
          comment_id: commentSelf.id, content: commentSelf.new_reply_content
        }, null, function (data) {
          try {
            commentSelf.replies.push({
              content: commentSelf.new_reply_content,
              create_at: (new Date()).getTime(),
              // todo (new Date()).getTime() => 1502112870976. it is not like this:[2017-08-07T21:25:50.248+08:00], used for DOM element title value
              id: data.Addition,
              status: 1,
              user: self.settings.user
            })
            commentSelf.new_reply_content = ''
            commentSelf.show_reply_box = false
            this.onMessage('回复成功')
          } catch (e) {
            this.onMessage('出了点错误,请重试')
          }
        }, function () {
          this.onMessage(Util.messages.NoAuthReplySnackBar)
        })
      },
      cancelReply: function (commentIndex) {
        this.comments[commentIndex].show_reply_box = false
      },
      toggleReplyBox: function (commentIndex, replyIndex) { // -1 ->is comment
        let atOne
        if (replyIndex < 0) {
          atOne = this.comments[commentIndex].user.name
        } else {
          atOne = this.comments[commentIndex].replies[replyIndex].user.name
        }
        this.comments[commentIndex].show_reply_box = true
        this.comments[commentIndex].new_reply_content = '@' + atOne
        // console.log($("#reply-box-"+commentIndex));
        setTimeout(function () {
          let box = $('#reply-box-' + commentIndex)
          box.trigger('change')
          box.trigger('focus')
        }, 200)
      }
    }
  }
</script>
