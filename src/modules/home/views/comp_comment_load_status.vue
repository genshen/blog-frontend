<style scoped>
  .comment-loader .loader-msg {
    margin: 0;
  }

  .comment-loader .loading-msg {
    margin-top: 16px;
  }
</style>

<template>
  <div class="comment-loader text-xs-center">
    <div v-show="status === 0 || status === 1">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="accent--text loading-msg" v-text="status===0?'正在加载评论...':'正在加载更多评论...'"></p>
    </div>  <!--/text-center-->
    <v-btn v-show="status === 2" flat color="primary" @click="$emit('load')">加载更多</v-btn>
    <v-btn v-show="status === 3" flat color="primary" disabled>没有更多评论了</v-btn>
    <div v-show="status === 4">
      <p class="accent--text loader-msg">评论加载失败...</p>
      <v-btn flat color="error" @click="$emit('load')" href="javascript:void(0)">重试</v-btn>
    </div>
    <div v-show="status === 5">
      <p class="accent--text loader-msg">无法加载更多内容...</p>
      <v-btn flat color="error" @click="$emit('load')" href="javascript:void(0)">重试</v-btn>
    </div>
  </div>
</template>

<script>
  import * as CC from './comment_config'

  export default {
    name: "comp_status",
    props: {
      status: {
        type: Number,
        default: CC.COM_STATUS_UNINIT,
      },
    }
  }
</script>
