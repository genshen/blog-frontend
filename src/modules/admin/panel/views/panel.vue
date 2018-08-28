<template>
  <v-container  grid-list-lg>
    <v-flex sm12>
      <h2>Posts</h2>
    </v-flex>
    <v-layout row wrap>
      <!-- mini statistic start -->
      <v-flex lg3 sm6 xs12>
        <mini-card icon="view_list" color="green" :router="{name: 'article_list'}" title="Posts List"></mini-card>
      </v-flex>
      <v-flex lg3 sm6 xs12>
        <mini-card icon="add" color="indigo" :router="{name: 'article_edit'}" title="Add Post"></mini-card>
      </v-flex>
    </v-layout>

    <v-flex sm12>
      <h2>Category</h2>
    </v-flex>

    <v-flex sm12>
      <h2>System</h2>
    </v-flex>
  </v-container>
</template>

<script>
import MiniCard from './widget_minicard'
export default {
  components: {
    MiniCard
  },
  ready () {
    // eslint-disable-next-line
    console.log('Home Ready.')
  },
  methods: {}
}
</script>
