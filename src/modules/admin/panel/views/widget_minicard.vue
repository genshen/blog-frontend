<!--this file if from:
https://github.com/tookit/vue-material-admin,
https://github.com/tookit/vue-material-admin/blob/5b82ceebe1a313ff8d805bdacfcccd2c615ff851/src/components/widgets/statistic/MiniStatistic.vue
-->
<template>
  <v-card hover :to="router">
    <v-card-text class="pa-0">
      <v-container class="pa-0">
        <div class="layout row ma-0">
          <div class="flex">
            <div class="layout column ma-0 justify-center align-center">
              <v-icon size="40px" :color="color">{{icon}}</v-icon>
            </div>
          </div>
        </div>
        <div class="layout row ma-0">
          <div class="flex text-sm-center py-3 white--text" :class="color">
            <div class="title">{{ title }}</div>
            <span class="caption">{{ subTitle }}</span>
          </div>
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    subTitle: String,
    color: String,
    router: Object
  }
}
</script>
<style scoped>
  .block-link{
    display: inline-block;
  }
</style>
