<template>
  <div class="settings-category-container">
    <div aria-hidden="true" class="modal modal-va-middle fade" id="category-edit-modal" role="dialog" tabindex="-1">
      <div class="modal-dialog modal-xs">
        <div class="modal-content">
          <div class="modal-heading">
            <p class="modal-title">添加分类</p>
          </div>
          <div class="modal-inner">
            <div class="form-group form-group-label">
              <label class="floating-label" for="category_edit_name">名称</label>
              <input v-model="new_category_name" class="form-control" id="category_edit_name" type="text">
            </div>
            <div class="form-group form-group-label">
              <label class="floating-label" for="category_edit_slug">内链</label>
              <input v-model="new_category_slug" class="form-control" id="category_edit_slug" type="text">
            </div>
          </div>
          <div class="modal-footer">
            <p class="text-right">
              <a class="btn btn-flat btn-brand-accent waves-attach waves-effect" data-dismiss="modal">取消</a>
              <a @click="addCategory" :disabled="new_category_submitting" v-text="new_category_submitting?'正在提交':'提交'"
                 class="btn btn-flat btn-brand-accent waves-attach waves-effect"></a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div aria-hidden="true" class="modal modal-va-middle fade" id="sub-category-edit-modal" role="dialog" tabindex="-1">
      <div class="modal-dialog modal-xs">
        <div class="modal-content">
          <div class="modal-heading">
            <p class="modal-title">添加子分类</p>
          </div>
          <div class="modal-inner">
            <div class="form-group form-group-label">
              <label class="floating-label" for="sub_category_name">名称</label>
              <input v-model="new_sub_category_name" class="form-control" id="sub_category_name" type="text">
            </div>
            <div class="form-group form-group-label">
              <label class="floating-label" for="sub_category_slug">内链</label>
              <input v-model="new_sub_category_slug" class="form-control" id="sub_category_slug" type="text">
            </div>
            <div class="form-group form-group-label">
              <label for="category-select">父级分类</label>
              <select v-model="new_sub_category_type" id="category-select">
                <option v-for="(category,index) in categories" v-bind:key="category.id" :value="index">
                  {{category.name}}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <p class="text-right">
              <a class="btn btn-flat btn-brand-accent waves-attach waves-effect" data-dismiss="modal">取消</a>
              <a :disabled="new_sub_category_submitting" v-text="new_sub_category_submitting?'正在提交':'提交'"
                 @click="addSubCategory" class="btn btn-flat btn-brand-accent waves-attach waves-effect"></a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <ul class="row breadcrumb" style="margin-bottom: 0">
        <li>
          <router-link :to="{name:'panel'}">首页</router-link>
        </li>
        <li class="active"><a href="javascript:void(0)">设置</a></li>
        <li class="active"><a href="javascript:void(0)">栏目分类</a></li>
      </ul>
      <div class="row">
        <div class="col-md-12 ">
          <div class="card">
            <div class="card-main">
              <div class="card-inner margin-bottom-no">
                <p class="card-heading">栏目分类
                  <a data-toggle="modal" data-target="#category-edit-modal"
                     class="btn btn-flat btn-brand-accent waves-attach waves-effect">
                    <i class="icon">add</i>添加分类</a>
                </p>
                <div class="settings-category-add">
                  <a data-toggle="modal" data-target="#sub-category-edit-modal"
                     class="fbtn fbtn-red waves-circle waves-light waves-effect">
                    <i class="icon">add</i></a>
                </div>
                <div class="card-table">
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                      <tr>
                        <th>父目录</th>
                        <th>父slug</th>
                        <th>名称</th>
                        <th>slug</th>
                        <th>包含帖子数量</th>
                        <th>操作</th>
                      </tr>
                      </thead>
                      <tbody>
                      <template v-for="category in categories">
                        <tr class="settings-category-ink-tr" v-bind:key="category.id">
                          <td><b>{{category.name}}</b></td>
                          <td><b>{{category.slug}}</b></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td><a href="javascript:void(0)">删除父级分类</a></td>
                        </tr>
                        <tr v-for="sub in category.sub_category" v-bind:key="sub.id">
                          <td></td>
                          <td></td>
                          <td>{{sub.name}}</td>
                          <td>{{sub.slug}}</td>
                          <td>{{sub.posts_count}}</td>
                          <td><a href="javascript:void(0)">删除分类</a></td>
                        </tr>
                      </template>
                      </tbody>
                    </table>
                    <div class="text-center" v-if="categories.length==0">正在加载...</div>
                  </div>
                </div>
              </div>
              <div class="card-action">
                <div class="card-action-btn pull-right">
                  <a class="btn btn-flat waves-attach waves-effect" href="javascript:void(0)"><span
                    class="icon">chevron_left</span></a>
                  <a class="btn btn-flat waves-attach waves-effect" href="javascript:void(0)"><span
                    class="icon">chevron_right</span></a>
                </div>
              </div>
            </div>
          </div><!---/card-->
        </div><!--/col-md-12-->
      </div>
    </div>
  </div>
</template>

<script>
import Util from '../../../../common/libs/utils/util'
import LocalUtils from '../utils/utils'
import ApiMap from '../utils/api_map'
export default {
  data: function () {
    return {
      categories: [],
      new_category_name: '',
      new_category_slug: '',
      new_category_submitting: false,
      new_sub_category_type: 0,
      new_sub_category_name: '',
      new_sub_category_slug: '',
      new_sub_category_submitting: false
    }
  },
  methods: {
    addCategory: function () {
      if (!this.new_category_submitting) {
        if (this.new_category_name === '' || this.new_category_slug === '') {
          $('body').snackbar({alive: 3000, content: '请填写完相关项后再提交'})
          return
        }
        this.new_category_submitting = true
        let self = this
        Util.network.postData.init(ApiMap.category.add, {
          name: this.new_category_name,
          slug: this.new_category_slug
        },
        null, function (data) {
          self.categories.push({
            id: data.Addition,
            name: self.new_category_name,
            slug: self.new_category_name,
            sub_category: []
          })
          self.new_category_name = ''
          self.new_category_name = ''
          $('#category-edit-modal').modal('hide')
          $('body').snackbar({alive: 3000, content: '分类添加成功'})
        }, null, null, null, function () {
          self.new_category_submitting = false
        })
      }
    },
    addSubCategory: function () {
      // console.log(this.new_sub_category_type);
      if (this.new_sub_category_name === '' || this.new_sub_category_slug === '') {
        $('body').snackbar({alive: 3000, content: '请填写完相关项后再提交'})
        return
      }
      let index = this.new_sub_category_type
      let _id = this.categories[index].id
      this.new_sub_category_submitting = true
      let self = this
      Util.network.postData.init(ApiMap.category.sub_add, {
        id: _id,
        name: this.new_sub_category_name,
        slug: this.new_sub_category_slug
      },
      null, function (data) {
        self.categories[index].sub_category.push({
          id: data.Addition,
          name: self.new_sub_category_name,
          slug: self.new_sub_category_slug,
          posts_count: 0
        })
        self.new_sub_category_name = ''
        self.new_sub_category_slug = ''
        $('#sub-category-edit-modal').modal('hide')
        $('body').snackbar({alive: 3000, content: '子分类添加成功'})
      }, null, null, null, function () {
        self.new_sub_category_submitting = false
      })
    }
  },
  created: function () {
    LocalUtils.loadCategories(this, this.categories)
  }
}
</script>
