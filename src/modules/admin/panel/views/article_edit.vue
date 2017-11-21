<template>
  <div class="article-edit-container">
    <div aria-hidden="true" class="modal modal-va-middle fade" id="upload_image_modal" role="dialog" tabindex="-1">
      <div class="modal-dialog modal-xs">
        <div class="modal-content">
          <div class="modal-heading">
            <p class="modal-title">上传图片</p>
          </div>
          <div class="modal-inner upload-image-field">
            <input @change="onUploadImageSelected" style="display: none" id="upload_image_input"
                   type="file" name="file" multiple accept="image/*"/>
            <div v-for="(image,index) in images" class="upload-image-preview">
              <div class="image-item">
                <img :src="image.src"/>
                <a v-if="image.status == -1" class="image-status" @click="uploadImageToServer(index)"
                   href="javascript:void(0)">重试</a>
                <a v-if="image.status == 0" class="image-status" href="javascript:void(0)">等待上传</a>
                <a v-if="image.status == 1" class="image-status" href="javascript:void(0)">正在上传</a>
                <a v-if="image.status == 2" class="image-status" @click="deleteUploadImage(index)"
                   href="javascript:void(0)">删除</a>
              </div>
            </div>
            <a class="add-image waves-effect waves-attach waves-circle fbtn fbtn-lg" @click="addUploadImage">
              <i class="icon">add</i></a>
          </div>
          <div class="modal-footer">
            <p class="text-right">
              <a class="btn btn-flat btn-brand-accent waves-attach waves-effect" data-dismiss="modal">取消</a>
              <a class="btn btn-flat btn-brand-accent waves-attach waves-effect" data-dismiss="modal">完成</a></p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <nav class="tab-nav tab-nav-green margin-top-no">
            <ul class="nav nav-justified">
              <li class="active">
                <a class="waves-attach waves-effect" data-toggle="tab" href="#article_edit_area">编辑</a>
              </li>
              <li>
                <a class="waves-attach waves-effect" data-toggle="tab" href="#article_edit_preview">预览</a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="col-md-12">
          <div class="tab-content">
            <div class="tab-pane fade active in" id="article_edit_area">
              <div class="form-group form-group-label" style="margin-bottom: 24px">
                <label class="floating-label" for="article_edit_title">标题</label>
                <input v-model="article_title" class="form-control" id="article_edit_title" type="text">
              </div>
              <div class="form-group form-group-label" style="margin-bottom: 24px">
                <label for="article_edit_category">分类</label>
                <select v-model="field_category_id" id="article_edit_category" type="text">
                  <option value="0">请选择主分类</option>
                  <option v-for="category in categories" :value="category.id">{{category.name}}</option>
                </select>
                <select v-model="field_sub_category_id" id="article_edit_sun_category" type="text">
                  <option value="0">请选择子分类</option>
                  <option v-for="category in sub_category_set" :value="category.id">{{category.name}}</option>
                </select>
              </div>
              <div class="form-group form-group-label">
                <label class="floating-label" for="article_edit_content">编辑</label>
                <textarea v-model="article_content" class="form-control" id="article_edit_content" rows="12"></textarea>
              </div>
              <div class="article-edit-footer">
                <ul class="nav nav-list margin-no pull-left">
                  <li><a class="btn btn-flat waves-effect" data-toggle="modal"
                         data-target="#upload_image_modal" title="上传图片" href="#">
                    <span class="icon">image</span></a>
                  </li>
                  <li class="dropdown">
                    <a class="dropdown-toggle text-black waves-attach waves-effect"
                       data-toggle="dropdown"><span class="icon">more_vert</span></a>
                    <ul class="dropdown-menu">
                      <li>
                        <a class="waves-attach waves-effect">
                          <span class="icon margin-right-sm">drafts</span>&nbsp;存为草稿</a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <div class="pull-right">
                  <a @click="submit" class="btn btn-flat btn-brand waves-attach waves-effect">提交</a>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="article_edit_preview">
              <article class="article-markdown markdown-preview">
                <Markdown :marked="article_content"></Markdown>
              </article>
            </div>
          </div>
        </div> <!---/col-md-12-->
      </div>
    </div>
  </div>
</template>

<script>
  import Markdown from '../../../../common/components/markdown'
  import LocalUtils from '../utils/utils'
  import ApiMap from '../utils/api_map'
  import Util from '../../../../common/libs/utils/util'

  export default {
    data: function () {
      return {
        categories: [],
        upload_config: {token: '', upload_path: '', domain: ''},
        image_uploading_processing: false,
        images: [], // {src:"blobUrl",status:0,file:fileObject}  //status:-1上传失败,0等待上传,1正在上传,2上传完成
        markedStatus: false,
        article_title: '',
        field_category_id: 0,
        field_sub_category_id: 0,
        article_content: ''
      }
    },
    components: {
      'markdown': Markdown
    },
    methods: {
      getUploadToken: function () {
        $.ajax({
          url: ApiMap.common.upload_token,
          context: this,
          success: function (data) {
            this.upload_config = data
          },
          error: function (req, err) {
            $('body').snackbar({alive: 3000, content: '加载上传配置信息出错了'})
          }
        })
      },
      addUploadImage: function () {
        if (this.upload_config.token) { // check upload_token
          $('#upload_image_input').trigger('click')
        } else {
          $('body').snackbar({alive: 3000, content: 'UploadToken无效'})
        }
      },
      onUploadImageSelected: function () {
        let files = $('#upload_image_input')[0].files
        let baseLength = this.images.length
        for (let i = 0; i < files.length; i++) {
          let src = window.URL.createObjectURL(files[i])
          this.images.push({src: src, status: 0, file: files[i]})
          this.uploadImageToServer(baseLength + i)
        }
      },
      uploadImageToServer: function (index) {
        if (index < this.images.length) {
          let image = this.images[index]
          let data = new FormData()
          data.append('token', this.upload_config.token)
          data.append('file', image.file)
          image.status = 1
          $.ajax({
            url: this.upload_config.upload_path,
            type: 'POST',
            data: data,
            context: this,
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {
              try {
                this.article_content += '![image](' + this.upload_config.domain + data.key + ')\r\n'
                image.status = 2
              } catch (e) {
                $('body').snackbar({alive: 3000, content: '上传出错了'})
                image.status = -1
              }
            },
            error: function () {
              $('body').snackbar({alive: 3000, content: '上传出错了'})
              image.status = -1
            }
          })
        } // end if
      },
      deleteUploadImage: function (index) {
        if (index < this.images.length) {
          this.images.splice(index, 1)
        }
      },
      submit: function () {
        if (!this.article_title) {
          $('body').snackbar({content: '标题不能为空', alive: 4000})
          return
        } else if (!this.article_content) {
          $('body').snackbar({content: '内容不能为空', alive: 4000})
          return
        }
        let self = this
        Util.network.postData.init(ApiMap.article.publish, {  // todo category_id
          category_id: this.field_category_id,
          sub_category_id: this.field_category_id,
          title: this.article_title,
          content: this.article_content,
          summary: (this.article_content).replace(/<.*?>/ig, '')  // todo Marked
        }, null, function () {
          $('body').snackbar({content: '文章发布成功', alive: 4000})
          self.article_title = ''
          self.article_content = ''
        })
      }
    },
    computed: {
      sub_category_set: function () {
        if (this.field_category_id) {
          for (let index in this.categories) {
            if (this.categories[index].id === this.field_category_id) {
              this.field_sub_category_id = 0 // reset sub_category_id
              return this.categories[index].sub_category
            }
          }
        }
        return []
      }
    },
    created: function () {
      if (!this.markedStatus) {
        let self = this
        LocalUtils.loadCategories(this, this.categories)  // todo
      //  loadJS([Config.markedLibPath, Config.highlightLibPath, Config.mathJaxLibPath], function () {
        // Marked.setOptions({
        //   highlight: function (code) {
        //     return hljs.highlightAuto(code).value
        //   }
        // })
        self.markedStatus = true // todo remove status
//        })
      }
      // get image upload token
      this.getUploadToken()
    }
  }
</script>
