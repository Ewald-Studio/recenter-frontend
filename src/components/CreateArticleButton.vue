<template>
  <b-link @click="newArticle">
    <b-icon-plus-circle></b-icon-plus-circle>
    Новая публикация
  </b-link>
</template>

<script>
import api from "@/api"

export default {
  methods: {
    newArticle() {
      return api.media
        .newArticle()
        .then((article) => this.$emit("created", article))
    },
  },
}
</script>
