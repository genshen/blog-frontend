<style scoped>
  .post-edit-container, .markdown-container{
    padding: 16px;
    background: #ffffff;
  }
</style>
<template>
  <v-container>
    <!--<progress-bar ref="topProgress"></progress-bar>-->
    <v-dialog v-model="show_image_dialog" max-width="720px">
      <v-card>
        <v-card-title class="headline">上传图片</v-card-title>
        <v-card-text>
          <ImageUpload @on-success="onImageUploadSuccess" @on-fail="onImageUploadFail"
                       :upload_path="upload.upload_config.upload_path" :data="upload.upload_config.data"></ImageUpload>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="show_image_dialog = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" flat @click="show_image_dialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-tabs fixed-tabs>
      <v-tab>
        {{ $t("posts.edit.tab_title_edit") }}
      </v-tab>
      <v-tab>
        {{ $t("posts.edit.tab_title_preview") }}
      </v-tab>

      <v-tab-item class="post-edit-container">
        <v-card flat>
          <v-text-field v-model="article.article_title" label="Title"  append-icon="title" required></v-text-field>
          <v-text-field v-model="article.article_hash" label="Hash"  append-icon="link" required></v-text-field>
          <v-layout>
            <v-flex xs12 sm6>
              <v-select v-model="article.category_id" :items="categories" item-text="name" item-value="id" label="Category"></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select v-model="article.sub_category_id" :items="sub_category_items" item-text="name" item-value="id" label="Sub-Category"></v-select>
            </v-flex>
          </v-layout>
          <v-select v-model="article.field_tags" :items="test_tags" label="Tags" chips multiple solo append-icon="label"></v-select>
          <v-textarea name="markdown-input" box auto-grow flat label="Contents Here" rows="10"
                      append-icon="text_fields" v-model="article.article_content"></v-textarea>

          <v-card-actions>
            <v-btn flat icon color="blue-grey" @click="show_image_dialog = true">
              <v-tooltip bottom>
                <v-icon slot="activator">image</v-icon>
                <span>Add Image</span>
              </v-tooltip>
            </v-btn>

            <v-btn flat icon color="blue-grey">
              <v-tooltip bottom>
                <v-icon slot="activator">drafts</v-icon>
                <span>Save Draft</span>
              </v-tooltip>
            </v-btn>

            <v-btn flat icon color="blue-grey">
              <v-tooltip bottom>
                <v-icon slot="activator">more</v-icon>
                <span>More</span>
              </v-tooltip>
            </v-btn>

            <v-spacer></v-spacer>
            <v-btn
              :loading="submit_loader.loading"
              :disabled="submit_loader.loading"
              color="indigo"
              class="white--text"
              @click.native="submit">
              Upload
              <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-tab-item>

      <v-tab-item class="markdown-container">
        <Markdown :marked="article.article_content"></Markdown>
      </v-tab-item>
    </v-tabs>
    <!--<ImageUpload v-if="imageUploadComponentStatus" @on-success="onImageUploadSuccess" @on-fail="onImageUploadFail"-->
                 <!--:upload_path="upload_config.upload_path" :data="upload_config.data"></ImageUpload>-->
    <v-spacer class="mt-3"></v-spacer>

  </v-container>
</template>

<script>
import Markdown from '@/common/components/markdown'
import ImageUpload from '@/common/components/image-upload'
import LocalUtils from '../utils/utils'
import ApiMap from '../utils/api_map'
import net from '@/common/libs/net/net'

const CATEGORY_ID_EMPTY = 0
export default {
  data () {
    return {
      categories: [],
      upload: {
        image_file_domain: '',
        upload_config: { upload_path: '', custom_upload: false, data: {} },
        image_upload_status: false
      },
      // images: [], // {src:"blobUrl",status:0,file:fileObject}  //status:-1上传失败,0等待上传,1正在上传,2上传完成
      article: {
        article_title: '',
        article_hash: '',
        field_tags: '',
        category_id: CATEGORY_ID_EMPTY,
        sub_category_id: CATEGORY_ID_EMPTY,
        article_content: ''
      },
      submit_loader: {
        loading: false
      },
      show_image_dialog: false,
      test_tags: ['ABC', 'Alg', 'Go']
    }
  },
  components: {
    Markdown,
    ImageUpload
  },
  methods: {
    onImageUploadSuccess (image, data) {
      try {
        this.article.article_content += `![image](${this.upload.image_file_domain}${data.key})\r\n` // qiniu file upload.
        image.status = 2
      } catch (e) {
        image.status = -1
        this.onImageUploadFail(image, e)
      }
    },
    // eslint-disable-next-line
    onImageUploadFail (image, e) { // todo error of session timeout
      this.$snackbar(this.$t('posts.edit.error_image_upload'))
    },
    submit () {
      if (!this.article.article_title) {
        this.$snackbar(this.$t('posts.edit.error_title_blank'))
        return
      } else if (!this.article.article_content) {
        this.$snackbar(this.$t('posts.edit.error_content_blank'))
        return
      } else if (!this.article.article_hash) {
        this.$snackbar(this.$t('posts.edit.error_hash_blank'))
        return
      }

      this.submit_loader.loading = true
      net.apiPost(ApiMap.article.publish, { // todo tags
        category_id: this.article.category_id,
        sub_category_id: this.article.sub_category_id,
        title: this.article.article_title,
        content: this.article.article_content,
        summary: (this.article.article_content).replace(/<.*?>/ig, '') // todo Marked
      }, net.axios.load_admin_jwt_config(), () => { // success
        this.$snackbar(this.$t('posts.edit.publish_success'))
        this.article.article_title = ''
        this.article.article_content = ''
        this.article.article_hash = ''
        this.article.category_id = CATEGORY_ID_EMPTY
        this.article.sub_category_id = CATEGORY_ID_EMPTY
      }, () => { // on error
        this.$snackbar(this.$t('posts.edit.error_publishing'))
      }, () => { // response error
        this.$snackbar(this.$t('posts.edit.error_publishing'))
      }, () => { // un auth
        this.$snackbar(this.$t('posts.common.error_auth_needed'))
      }, () => {
        this.submit_loader.loading = false
      })
    }
  },
  computed: {
    sub_category_items () {
      for (const i in this.categories) {
        if (this.categories[i].id === this.article.category_id) {
          return this.categories[i].sub_category
        }
      }
      return []
    }
  },
  created () {
    LocalUtils.loadCategories(this, this.categories)
    // get image upload token
    net.axiosInstance.get(ApiMap.common.upload_token, net.axios.load_admin_jwt_config())
      .then((response) => {
        try {
          if (response && response.data) {
            this.upload.image_file_domain = response.data.domain
            this.upload.upload_config.upload_path = response.data.upload_path
            this.upload.upload_config.data.token = response.data.token // todo v-if
            this.upload.image_upload_status = true
            if (!this.upload.upload_config.custom_upload) {
              // add cookie for _xsrf
              try { // cookie may be null or something else bad data
                const xsrf = net.getXSRFCookie()
                this.upload.upload_config.data._xsrf = xsrf
              } catch (err) {
                this.$snackbar(this.$t('common.error_getting_config'))
              }
            }
          }
        } catch (e) {
          this.$snackbar(this.$t('common.error_getting_config'))
        }
      }).catch(() => { // todo add un-auth snackbar.
        this.$snackbar(this.$t('common.error_getting_config'))
      })
  }
}
</script>
