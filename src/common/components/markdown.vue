<style>
  /*markdown style */
  .marked-render pre,.marked-render pre code {
    border: none;
    display: block;
  }

  /* code style*/
  .marked-render pre code {
    border: none;
    display: block;
    padding: 8px;
    letter-spacing: 0;
    background: #fafafa;
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  .marked-render pre code:after, .marked-render pre code:before{
    content: ''
  }

  .marked-render h1, .marked-render h2, .marked-render h3, .marked-render h4, .marked-render h5, .marked-render h6 {
    margin-top: 12px;
  }

  .marked-render img {
    max-width: 100%;
    overflow-x: scroll;
  }
</style>

<template>
  <div class="marked-render" v-html="markedHtml"></div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import Prism from '@/common/libs/prism/prismjs'
import '@/common/libs/prism/themes/prism.css'

export default {
  name: 'markdown',
  props: {
    marked: {
      required: true,
      type: String
    }
  },
  data () {
    return { markdownInstance: null }
  },
  computed: {
    markedHtml () {
      return this.markdownInstance.render(this.marked)
    }
  },
  created () {
    this.markdownInstance = new MarkdownIt({
      highlight (code, lang) {
        if (code) {
          try {
            return Prism.highlight(code, Prism.languages[lang], lang)
          } catch (__) {
            return null
          }
        }
        return code // use external default escaping
      }
    })
  },
  methods: {}
}
</script>
