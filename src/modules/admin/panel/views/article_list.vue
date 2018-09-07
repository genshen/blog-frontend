<style>
  .post-list-table {
    width:100%;
  }
</style>
<template>
  <v-container grid-list-lg>
    <h4 class="headline">Article List</h4>
    <v-data-table :headers="table.header" :items="posts" hide-actions class="post-list-table">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-right">{{ props.item.title }}</td>
        <td class="text-xs-right">{{ props.item.created_at }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import ApiMap from '../utils/api_map'
import net from '@/common/libs/net/net'

export default {
  data () {
    return {
      posts: [],
      table: {
        header: [
          { text: 'Id', value: 'id' },
          { text: 'Title', value: 'title' },
          { text: 'Created At', value: 'created_at' }
        ]
      }
    }
  },
  methods: {},
  created () {
    // todo loading.
    net.axiosInstance.get(ApiMap.article.list, { params: { skip: 0, count: 8 } })
      .then((response) => {
        if (response && response.data) {
          for (const i in response.data) {
            this.posts.push({
              id: response.data[i].id,
              title: response.data[i].title,
              category_id: response.data[i].category_id,
              sub_category_id: response.data[i].sub_category_id,
              view_count: response.data[i].view_count,
              comment_count: response.data[i].comment_count,
              reply_count: response.data[i].reply_count,
              created_at: response.data[i].create_at
            }) // todo self data.
          }
        }
      }).catch(() => {
      })
  }
}
</script>
