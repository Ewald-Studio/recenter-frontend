<template>
  <div>
    <div>
      <b-input v-model="article.title" placeholder="Заголовок"> </b-input>
      <b-textarea v-model="article.text" placeholder="Текст"> </b-textarea>
    </div>
    <div class="mt-4" align="right">
      <b-button @click="approveArticle">Опубликовать</b-button>
      <b-button class="ml-2" @click="rejectArticle"
        >Вернуть на доработку</b-button
      >
    </div>
  </div>
</template>

<script>
import api from "@/api"

export default {
  props: ["article"],
  data() {
    return {}
  },
  methods: {
    rejectArticle() {
      return api.media
        .rejectArticle(this.article.id)
        .then((data) => this.$emit("update-list"))
    },
    approveArticle() {
      return api.media
        .approveArticle(this.article.id)
        .then((data) => this.$emit("update-list"))
    },
  },
}
</script>

<style></style>
