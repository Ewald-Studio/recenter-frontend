<template>
  <div>
    <div>
      {{ articles }}
    </div>
    <b-button @click="test">get articlies</b-button>
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
    test() {
      return api.media.articles().then((data) => (this.articles = data))
    },
  },
}
</script>
