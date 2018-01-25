<style scoped>
  .blog-detail-mate {
    margin-top: 16px;
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
  <div class="detail-container">
    <div class="content-header ui-content-header">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 col-lg-offset-3 col-md-10 col-md-offset-1">
            <h1 class="content-heading">{{article.title}}</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="blog-detail-mate col-md-12 col-lg-10 col-lg-push-1">
          <span class="avatar inline-avatar">
            <a :href="settings.profile.url" target="_blank">
              <img alt="Avatar" :src="settings.profile.avatar">
            </a>
          </span>
          <span class="refer-me">
            By <a :href="settings.profile.url"
                  target="_blank">{{settings.profile.name}}</a>&nbsp;·&nbsp;</span>
          <span class="label label-brand" :title="article.created_at">{{article.created_at | formatTime}}</span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 col-lg-10 col-lg-push-1 blog-article markdown-preview">
          <hr>
          <article class="markdown-preview">
            <Markdown :marked="article.content"></Markdown>
          </article>
          <hr>
        </div>
      </div>

      <div class="row"> <!--row1 start-->
        <div class="col-md-12 col-lg-10 col-lg-push-1">
          <div class="row comment-area">
            <p class="col-md-12"><b>{{comments.length}}条评论</b></p>
            <div class="col-md-12 form-group form-group-label comment-form">
              <label class="floating-label" for="comment-input" style="left:auto;">你的评论</label>
              <textarea v-model="comment_text" class="form-control" id="comment-input" rows="4"
                        style="resize: none"></textarea>
              <div class="help-block pull-left"><code>支持Markdown输入</code></div>
              <div class="pull-right">
                <a title="预览" class="btn btn-flat btn-brand waves-attach waves-effect">
                  <span class="icon icon-lg">visibility</span></a>
                <a @click="submitComment" class="btn btn-brand  waves-attach waves-effect">发布</a>
              </div>
            </div>
            <div class="clearfix"></div>
            <div id="comment-flag" style="height:8px"></div>
            <div v-for="(comment,comment_index) in comments" v-bind:key="comment_index" :class="{'comments-border':comment_index != 0}"
                 class="col-md-12 comment-item">
              <div class="comment-mate">
                <span class="avatar inline-avatar">
                  <a :href="comment.user.url" target="_blank">
                    <img alt="Avatar" :src="comment.user.avatar">
                  </a>
                </span>
                <span class="user-refer">
                  <a :href="comment.user.url" target="_blank">{{comment.user.name}}</a>&nbsp;
                </span>
                <span class="label label-brand"
                      :title="comment.create_at">{{comment.create_at | formatTime}}</span>
                <a @click="toggleReplyBox(comment_index,-1)" href="javascript:void(0)"
                   class="pull-right reply-refer">
                  <i class="icon icon-2x">reply</i><span>回复</span>
                </a>
              </div>
              <div class="comment-content">
                {{comment.content}}
              </div>
              <div class="reply-area row">
                <div v-for="(reply,reply_index) in comment.replies" v-bind:key="reply_index" class="clo-md-12 reply-item">
                  <div class="comment-mate">
                    <span class="avatar inline-avatar">
                      <a :href="reply.user.url" target="_blank">
                        <img alt="Avatar" :src="reply.user.avatar">
                      </a>
                    </span>
                    <span class="user-refer">
                      <a :href="reply.user.url" target="_blank">{{reply.user.name}}</a>&nbsp;
                    </span>
                    <span class="label label-brand"
                          :title="reply.create_at">{{reply.create_at | formatTime}}</span>
                    <a @click="toggleReplyBox(comment_index,reply_index)" href="javascript:void(0)"
                       class="pull-right reply-refer">
                      <i class="icon icon-2x">reply</i><span>回复</span>
                    </a>
                  </div>
                  <div class="reply-content">
                    {{reply.content}}
                  </div>
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
            <div v-show="comment_load_status === 0 || comment_load_status === 1" class="text-center">
              <div class="progress-circular progress-circular-inline progress-circular-green">
                <div class="progress-circular-wrapper">
                  <div class="progress-circular-inner">
                    <div class="progress-circular-left">
                      <div class="progress-circular-spinner"></div>
                    </div>
                    <div class="progress-circular-gap"></div>
                    <div class="progress-circular-right">
                      <div class="progress-circular-spinner"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-green" v-text="comment_load_status==0?'正在加载评论...':'正在加载更多评论...'"></p>
            </div>  <!--/text-center-->
            <div v-show="comment_load_status == 2" class="text-center">
              <a @click="loadComment" class="btn btn-flat btn-green waves-attach waves-effect">加载更多</a>
            </div>
            <div v-show="comment_load_status == 3" class="text-center">
              <a disabled="disabled" class="btn btn-flat btn-green waves-attach waves-effect">没有更多评论了</a>
            </div>
            <div v-show="comment_load_status == 4" class="text-center">
              <span>评论加载失败...</span>
              <a @click="loadComment" href="javascript:void(0)"
                 class="btn btn-flat btn-red waves-attach waves-effect">重试</a>
            </div>
            <div v-show="comment_load_status == 5" class="text-center">
              <span>无法加载更多内容...</span>
              <a @click="loadComment" href="javascript:void(0)"
                 class="btn btn-flat btn-red waves-attach waves-effect">重试</a>
            </div>
          </div>

        </div>
      </div> <!--row end-->

    </div>
  </div>
</template>
<script>
import Markdown from '../../../common/components/markdown'
import ApiMap from '../api_map'
import Util from '../../../common/libs/utils/util'
import Config from '../../../common/config/config'

export default {
  props: ['settings'],
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
      comments: [],
      comments_loaded_count: 0,
      comment_load_status: -1, // 0 for loading(init),1 for loading, 2 for loaded(has more),
      // 3 for loaded(no more),4 for failed to load(init),5 for failed to load
      comment_text: ''
    }
  },
  components: {
    Markdown
  },
  methods: {
    setCommentLoad () {
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
    loadComment () {
      if (this.comment_load_status === 0 || this.comment_load_status === 1) {
        return
      }
      let start = this.comments_loaded_count
      this.comment_load_status = start === 0 ? 0 : 1
      let self = this
      $.ajax({
        url: ApiMap.detail.comments(this.$route.params.id, start),
        success: function (data) {
          try {
            data.forEach(function (e) {
              if (!self.containsComment(e.id)) {
                e.show_reply_box = false
                e.new_reply_content = ''
                self.comments.unshift(e)
              }
            })
            self.comments_loaded_count += data.length
            self.comment_load_status = data.length === Config.blog.maxCommentLength ? 2 : 3 // 2(has more) or 3(not more)
          } catch (err) {
            self.comment_load_status = start === 0 ? 4 : 5
          }
        },
        error: function () {
          self.comment_load_status = start === 0 ? 4 : 5 // 4 or 5
        }
      })
    },
    containsComment: function (id) {
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
        Util.ui.snackbar({alive: 3000, content: '评论内容不能为空'})
        return
      }
      if (!this.settings.is_auth) {
        $('#auth_model').modal('show')
        return
      }

      let self = this
      Util.network.postData.init(ApiMap.detail.commentAdd, { // todo
        post_id: this.article.id, content: this.comment_text
      }, null, function (data) {
        self.comments.unshift({
          content: self.comment_text,
          create_at: (new Date()).getTime(),
          id: data.Addition,
          replies: [],
          status: 1,
          user: self.settings.user,
          show_reply_box: false,
          new_reply_content: ''
        })
        self.comment_text = ''
        Util.ui.snackbar({content: '评论成功', alive: 3000})
      }, function () {
        Util.ui.snackbar({alive: 3000, content: Util.messages.NoAuthCommentSnackBar})
      })
    },
    submitReply: function (commentIndex) {
      let commentSelf = this.comments[commentIndex]
      if (commentSelf.new_reply_content === '') {
        Util.ui.snackbar({alive: 3000, content: '回复内容不能为空'})
        return
      }
      if (!this.settings.is_auth) {
        $('#auth_model').modal('show')
        return
      }
      let self = this
      Util.network.postData.init(ApiMap.detail.replyAdd, {
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
          Util.ui.snackbar({alive: 3000, content: '回复成功'})
        } catch (e) {
          Util.ui.snackbar({alive: 3000, content: '出了点错误,请重试'})
        }
      }, function () {
        Util.ui.snackbar({alive: 3000, content: Util.messages.NoAuthReplySnackBar})
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
  },
  //  beforeCreate () {
  //      Marked.setOptions({
  //        highlight: function (code) {
  //          return hljs.highlightAuto(code).value
  //        }
  //      })
  //    },
  mounted: function () {
    let self = this
    $.ajax({
      url: ApiMap.detail.content(this.$route.params.id),
      success: function (data) { // what if it is not json?
        try {
          if (!data.id) {
            Util.ui.snackbar({alive: 4000, content: 'Oh,Snap! 查看的文章不存在'})
            return
          }
          if (!data.cover) {
            data.cover = '/static/assets/img/brand.jpg' // todo image name
          }
          self.article = data
        } catch (err) {
          Util.ui.snackbar({alive: 3000, content: Util.messages.NormalErrorSnackBar})
        }
      },
      error: function () {
        Util.ui.snackbar({alive: 3000, content: Util.messages.NormalErrorSnackBar})
      }
    })
    setTimeout(this.setCommentLoad, 100)
  }
}
</script>
