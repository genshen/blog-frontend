<template>
  <v-snackbar
    :absolute="absolute"
    :auto-height="autoHeight"
    :bottom="bottom"
    :left="left"
    :top="top"
    :right="right"
    :color="color"
    :multi-line="multiLine"
    :timeout="timeout"
    :vertical="vertical"
    :value="value"
    v-model="active"
    @click="dismiss"
  >
    <v-icon dark left v-if="!!icon" class="mr-4">{{ icon }}</v-icon>
    {{ message }}
    <v-btn dark flat v-if="!!dismissable" :color="dismissColor" @click="active = false">
      {{dismissText}}
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    name: "snackbar",
    data() {
      return {
        active: false,
      }
    },
    props: {
      dismissable: {
        type: Boolean,
        default: true,
      },
      dismissText: {
        type: String,
        default: 'Close',
      },
      icon: {
        type: String,
        default: undefined,
      },
      absolute: {
        type: Boolean,
        default: false
      },
      autoHeight: {
        type: Boolean,
        default: false
      },
      bottom: {
        type: Boolean,
        default: true
      },
      left: {
        type: Boolean,
        default: false
      },
      top: {
        type: Boolean,
        default: false
      },
      right: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: undefined
      },
      dismissColor: {
        type: String,
        default: 'pink'
      },
      multiLine: {
        type: Boolean,
        default: false
      },
      timeout: {
        type: Number,
        default: 3000
      },
      vertical: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object | Boolean | Number,
        default: undefined,
      }
    },
    mounted() {
      this.$nextTick(() => this.show())
    },
    methods: {
      show() {
        this.active = true
      },
      close() {
        this.active = false
      },
      dismiss() {
        if (this.dismissable) {
          this.active = false
        }
      }
    }
  }
</script>

<style scoped>

</style>
