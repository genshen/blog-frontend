<template>
  <v-container>
    <v-layout>
      <v-dialog v-model="dialog.add_category" persistent max-width="720px">
        <v-card>
          <v-card-title>
            <span class="headline">Add Category</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="new_category_name" label="Name" hint="name" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="new_category_slug" label="Slug" hint="used in url" required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="dialog.add_category = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click.native="addCategory">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialog.add_sub_category" persistent max-width="720px">
        <v-card>
          <v-card-title>
            <span class="headline">Add Sub-Category</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="new_sub_category_name" label="Name" hint="name" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="new_sub_category_slug" label="Slug" hint="used in url" required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="dialog.add_sub_category = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click.native="addSubCategory">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-flex>
        <v-card>
          <v-card-text>
            <v-list>
              <v-list-group v-for="category in categories" :key="category.id" prepend-icon="category" no-action>
                <v-list-tile slot="activator">
                  <v-list-tile-content>
                    <v-list-tile-title> title: {{ category.name }}</v-list-tile-title>
                    <v-list-tile-sub-title>slug: {{ category.slug}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn flat icon color="red" @click.native="delCategory(category.id)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>

                <v-list-tile v-for="sub in category.sub_category" :key="sub.id">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ sub.name }}</v-list-tile-title>
                    <v-list-tile-sub-title>slug: {{ sub.slug}}</v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn flat icon color="red" @click.native="delSubCategory(sub.id)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-content>
                    <v-btn flat icon color="primary" @click.native="openAddSubDialog(category.id)">
                      <v-icon >add</v-icon>
                    </v-btn>
                  </v-list-tile-content>
                </v-list-tile>

              </v-list-group>
            </v-list>
          </v-card-text>

          <v-card-actions>
            <v-btn flat color="primary"  @click.native="dialog.add_category = true"> {{ $t("category.add") }}
              <v-icon dark>add</v-icon>
            </v-btn>
            <v-btn flat color="orange">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LocalUtils from '../utils/utils'
import net from "@/common/libs/net/net"
import ApiMap from '../utils/api_map'

export default {
  data: function () {
    return {
      dialog:{
        add_category: false,
        add_sub_category: false
      },
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
    addCategory () {
      if (!this.new_category_submitting) {
        if (this.new_category_name === '' || this.new_category_slug === '') {
          this.$snackbar(this.$t('category.error_adding_not_filled')) // todo
          return
        }
        this.new_category_submitting = true // todo loading.
        net.apiPost(ApiMap.category.add,{
          name: this.new_category_name,
          slug: this.new_category_slug
          }, net.axios.load_admin_jwt_config(),
          (data) => {
            if (data) {
              this.categories.push({
                id: data.addition,
                name: this.new_category_name,
                slug: this.new_category_name,
                sub_category: []
              })
              this.new_category_name = ''
              this.new_category_name = ''
              this.$snackbar(this.$t('category.category_adding_success'))
            } else {
              this.$snackbar(this.$t('category.error_adding_category'))
            }
          }, () => {    // on error(e.g. network)
            this.$snackbar(this.$t('category.error_adding_category'))
          },(error) => { // on response error
            for (let key in error) {
              let message = error[key]
              this.$snackbar(message)
              return
            }
          }, () =>{ // on un_auth
            this.$snackbar(this.$t('common.error_auth_needed'))
          }, () => { // on finish
            this.dialog.add_category = false
            this.new_category_submitting = false
          })
      }
    },
    delCategory(id) {
      id = id + 1
      return id
    },
    openAddSubDialog(parent_id){
      // show dialog for adding sub category.
      this.new_sub_category_type = parent_id
      this.dialog.add_sub_category = true
    },
    addSubCategory () {
      if (this.new_sub_category_name === '' || this.new_sub_category_slug === '') {
        this.$snackbar(this.$t('error_adding_sub_not_filled'))
        return
      }
      // let _id = this.categories[index].id
      this.new_sub_category_submitting = true
      let self = this
      net.apiPost(ApiMap.category.sub_add, {
          id: this.new_sub_category_type,
          name: this.new_sub_category_name,
          slug: this.new_sub_category_slug
        }, net.axios.load_admin_jwt_config(), (data) => {
          this.addSubToCategory(this.new_sub_category_type, data.addition, this.new_sub_category_name, this.new_sub_category_slug, 0)
          self.new_sub_category_name = ''
          self.new_sub_category_slug = ''
          this.$snackbar('子分类添加成功')
        },() => {    // on error(e.g. network)
          this.$snackbar(this.$t('category.error_adding_sub_category'))
        },(error) => { // on response error
          for (let key in error) {
            let message = error[key]
            this.$snackbar(message)
            return
          }
        }, () =>{ // on un_auth
          this.$snackbar(this.$t('common.error_auth_needed'))
        }, () => {
        this.new_sub_category_submitting = false
        this.dialog.add_sub_category = false
      }
      )
    },
    addSubToCategory(parent_id, id, name, slug, count) {
      let len = this.categories.length
      for(let i = 0; i<len; i++){
        if(this.categories[i].id === parent_id){
          this.categories[i].sub_category.push({
            id: id, name:name,
            slug: slug,
            posts_count: count
          })
          break
        }
      }
    },
    delSubCategory(id) {
      return id++
    }
  },
  created: function () {
    LocalUtils.loadCategories(this, this.categories)
  }
}
</script>
