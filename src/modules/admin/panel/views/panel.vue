<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-main">
            <div class="card-inner">
              <p class="card-heading text-brand">文章</p>
              <router-link :to="{name: 'article_list'}"
                           class="btn btn-brand waves-attach waves-effect">
                <i class="icon icon-lg">list</i><br>
                <span>文章列表</span>
              </router-link>
              <router-link :to="{name: 'article_edit'}" class="btn btn-brand waves-attach waves-effect">
                <i class="icon icon-lg">create</i><br>
                <span>撰写文章</span>
              </router-link>
              <a class="btn btn-brand waves-attach waves-effect">
                <i class="icon icon-lg">drafts</i><br>
                <span>草稿箱</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div><!---row-->
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-main">
            <div class="card-inner">
              <p class="card-heading text-brand">应用与作品</p>
              <a class="btn btn-brand waves-attach waves-effect">
                <i class="icon icon-lg">palette</i><br>
                <span>HelloUSTB</span>
              </a>
              <a class="btn btn-brand waves-attach waves-effect">
                <i class="icon icon-lg">palette</i><br>
                <span>Match</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div><!---row-->
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-main">
            <div class="card-inner">
              <p class="card-heading text-brand">设置</p>
              <router-link :to="{name: 'category'}" class="btn btn-brand waves-attach waves-effect">
                <i class="icon icon-lg">class</i><br>
                <span>栏目分类</span>
              </router-link>
              <a class="btn btn-brand waves-attach waves-effect">
                <i class="icon icon-lg">palette</i><br>
                <span>系统设置</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div><!---row-->
  </div>
</template>

<script>
  export default {
    methods: {},
    ready: function () {
      console.log('Home Ready.')
    }
  }
</script>
