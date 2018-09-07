<style scoped>
  .article-cover {
    width: 100%;
    height: 100%;
    justify-content: center;
    overflow: hidden;
  }

  .article-title a {
    /*color:#50596c;*/
    text-decoration: none;
    text-shadow: 1px 1px 4px #eee;
  }
</style>
<template>
  <v-container fill-height>
    <v-layout row wrap align-center>
      <v-flex xs12 md10 offset-md1 v-for="blog in lists" :key="blog.id">
        <v-card class="my-3" hover>
          <v-img v-if="blog.cover" height="170" class="article-cover" :src="blog.cover"></v-img>
          <v-card-title>
            <v-layout row wrap>
              <v-flex xs12 class="article-title">
                <router-link :to="{name:'detail',params:{id:blog.id}}">
                  <h3 class="headline blue-grey--text">{{ blog.title }}</h3>
                </router-link>
              </v-flex>
              <v-flex xs12>
                <span class="grey--text text--lighten-1" :title="blog.create_at">{{blog.create_at | formatTime}}</span>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                {{ blog.summary }}
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat :to="{name:'detail',params:{id:blog.id}}" class="blue--text">
              Read More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import ApiMap from '../api_map'
import Util from '@/common/libs/utils/util'
import net from '@/common/libs/net/net'

export default {
  data () {
    return {
      lists: []
    }
  },
  methods: {},
  created () {
    this.$Progress.start()
    net.axiosInstance.get(ApiMap.list.def, { // todo different category
      params: {
        show_summary: true,
        skip: 0,
        count: 12
      }
    }).then((response) => {
      try {
        this.$Progress.finish()
        for (const i in response.data) {
          if (!response.data[i].cover) {
            response.data[i].cover = '/static/assets/imgs/brand.jpg' // todo
          }
          this.lists.push(response.data[i])
        }
      } catch (err) {
        this.$Progress.fail()
        this.$snackbar(Util.messages.SnackbarErrorMessage)
      }
    })
      .catch(function () {
        this.$Progress.fail()
        this.$snackbar(Util.messages.SnackbarErrorMessage)
      })
  },
  route: {
    data () {
      window.console.log('data!@')
    }
  }
}
</script>
