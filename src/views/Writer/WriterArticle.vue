<template>
  <div>
    <div>
      <b-input v-model="article.title" placeholder="Заголовок"> </b-input>
      <b-textarea class="mt-2" v-model="article.text" placeholder="Текст">
      </b-textarea>
    </div>
    <div class="mt-4" align="right">
      <b-button
        v-if="article.status == 'NEW' || article.status == 'REJECTED'"
        @click="saveArticle"
        >Сохранить</b-button
      >
      <b-button
        class="ml-2"
        v-if="article.status == 'NEW' || article.status == 'REJECTED'"
        @click="saveAndSendToModerationArticle"
        >Сохранить и отправить на модерацию</b-button
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
    saveArticle() {
      console.log(this.article)
      return api.media.saveArticle(this.article)
    },
    saveAndSendToModerationArticle() {
      console.log(this.article)
      return this.saveArticle(this.article)
        .then((data) => api.media.sendToModeration(this.article.id))
        .then(() => this.$emit("update-list"))
    },
  },
}
</script>

<style></style>
