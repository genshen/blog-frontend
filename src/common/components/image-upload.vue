<style scoped>
  .upload-image-preview{
    display: inline-table;
  }.upload-image-preview .image-item{
     display: inline-block;
     margin:auto 4px;
   }
  .upload-image-preview img{
    width:6em;
    height:6em;
    border:ridge rgba(255, 128, 171, 0.47) 1px;
  }
  .upload-image-preview .image-status{
    display: block;
    text-align:center;
    margin-top:2px;
  }
  .upload-image-field .add-image{
    display: inline-block;
    vertical-align: top;
  }
</style>

<template>
  <div class="upload-image-field">
    <input @change="onUploadImageSelected" onclick="this.value = null;" style="display: none" id="upload_image_input"
           type="file" name="file" multiple accept="image/*"/>
    <div v-for="(image,index) in images" v-bind:key="index" class="upload-image-preview">
      <div class="image-item">
        <img :src="image.src"/>
        <a v-if="image.status == -1" class="image-status" @click="reTryUpload(index)"
           href="javascript:void(0)">重试</a>
        <a v-if="image.status == 0" class="image-status" href="javascript:void(0)">等待上传</a>
        <a v-if="image.status == 1" class="image-status" href="javascript:void(0)">正在上传</a>
        <a v-if="image.status == 2" class="image-status" @click="deleteUploadImage(index)"
           href="javascript:void(0)">删除</a>
      </div>
    </div>
    <v-btn fab dark color="indigo" @click="addUploadImage">
      <v-icon dark>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
import net from '@/common/libs/net/net'

/**
 * props:
 *   customUpload: be false by default;
 *   data: addition data(key-value) in HTTP-Post body.(using FormData)
 *  event: @on-success=func(image,data);@on-fail=func(image,error) ; @on-upload=func(image,optional)
 */
export default {
  data () {
    return {
      images: [] // {src:"blobUrl",status:0,file:fileObject}  //status:-1上传失败,0等待上传,1正在上传,2上传完成
    }
  },
  props: {
    upload_path: {
      required: true,
      type: String,
      default () {
        return ''
      }
    },
    custom_upload: {
      required: false,
      type: Boolean,
      default () {
        return false
      }
    },
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    option () {
      return {
        upload_path: this.upload_path,
        custom_upload: this.custom_upload,
        data: this.data
      }
    }
  },
  methods: {
    addUploadImage () {
      $('#upload_image_input').trigger('click') // token checker?
    },
    reTryUpload (index) {
      if (index < this.images.length) {
        this.uploadImageToServer(this.images[index])
      }
    },
    deleteUploadImage (index) {
      if (index < this.images.length) {
        this.images.splice(index, 1)
      }
    },
    onUploadImageSelected () {
      const files = $('#upload_image_input')[0].files
      for (let i = 0; i < files.length; i++) {
        const src = window.URL.createObjectURL(files[i])
        const image = { src, status: 0, file: files[i] }
        this.images.push(image)
        this.uploadImageToServer(image)
      }
    },
    uploadImageToServer (image) { // upload a image to server
      if (this.option.custom_upload) {
        this.$emit('on-upload', image, this.optional)
        return
      }
      if (!this.option.upload_path) {
        // todo toast error.
        return
      }
      const data = new FormData()
      data.append('file', image.file)
      if (this.option.data) { // add additional data to formData.
        for (const key in this.option.data) {
          data.append(key, this.option.data[key])
        }
      }
      image.status = 1
      net.axiosFileInstance.post(this.option.upload_path, data, net.axios.load_admin_jwt_config())
        .then((response) => {
          this.$emit('on-success', image, response.data)
        }).catch((err) => {
          image.status = -1
          this.$emit('on-fail', image, err)
        })
    }
  }
}
</script>
