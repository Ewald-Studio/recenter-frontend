<template>
  <div>
    <div>
      {{ articles }}
    </div>
    <b-button @click="getArticles">get articlies</b-button>
  </div>
</template>

<script>
import api from "@/api"

export default {
  data() {
    return {
      articles: null,
    }
  },
  methods: {
    getArticles() {
      return api.media.articles().then((data) => (this.articles = data))
    },
  },
}
</script>
