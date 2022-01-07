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
        @click="deleteArticle"
        variant="link">
        Удалить
      </b-button>
      <b-button
        class="ml-2"
        v-if="article.status == 'NEW' || article.status == 'REJECTED'"
        @click="saveArticle"
        variant="success">
        Сохранить
      </b-button>
      <b-button
        class="ml-2"
        v-if="article.status == 'NEW' || article.status == 'REJECTED'"
        @click="saveAndSendToModerationArticle"
        variant="primary">
        Сохранить и отправить на модерацию
      </b-button>
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
      return api.media.saveArticle(this.article)
    },
    saveAndSendToModerationArticle() {
      if (
        confirm(
          "Отправить публикацию на модерацию? В ходе модерации редактирование публикации невозможно.",
        )
      ) {
        return this.saveArticle(this.article)
          .then((data) => api.media.sendToModeration(this.article.id))
          .then(() => {
            this.$emit("update-list")
            this.article.status = "MODERATION"
          })
      }
    },
    deleteArticle() {
      if (confirm("Вы действительно хотите удалить эту публикацию?")) {
        return this.saveArticle(this.article)
          .then((data) => api.media.deleteArticle(this.article.id))
          .then(() => {
            this.$emit("article-deleted")
          })
      }
    },
  },
}
</script>

<style></style>
