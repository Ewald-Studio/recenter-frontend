<template>
  <div>
    <div>
      <b-input v-model="article.title" placeholder="Заголовок"> </b-input>
      <b-textarea class="mt-2" v-model="article.text" placeholder="Текст">
      </b-textarea>
    </div>

    <div class="mt-4">
      <p v-for="comment in article.comments" :key="comment.id">
        {{ comment.text }}
      </p>
      <b-button v-if="new_comment.text == null" class="mt-4" @click="newComment"
        >Новый комментарий</b-button
      >
    </div>
    <div class="mt-2">
      <textarea
        v-if="new_comment.text != null"
        v-model="new_comment.text"></textarea>
    </div>
    <div class="mt-4" align="right">
      <b-button @click="rejectArticle" variant="outline-danger">
        Вернуть на доработку
      </b-button>
      <b-button class="ml-2" @click="approveArticle" variant="outline-success">
        Опубликовать
      </b-button>
    </div>
  </div>
</template>

<script>
import api from "@/api"

export default {
  props: ["article"],
  data() {
    return {
      new_comment: {
        article: this.article.id,
        text: null,
      },
    }
  },
  methods: {
    rejectArticle() {
      if (confirm("Вернуть на доработку?")) {
        this.article.comments.push(this.new_comment)
        return api.media
          .rejectArticle(this.article.id, this.new_comment)
          .then((data) => {
            return api.media.newComment(this.new_comment)
          })
          .then((data) => this.$emit("update-list"))
      }
    },
    approveArticle() {
      if (confirm("Подтвердите публикацию статьи")) {
        return api.media
          .approveArticle(this.article.id)
          .then((data) => this.$emit("update-list"))
      }
    },
    newComment() {
      this.new_comment.text = ""
    },
  },
}
</script>

<style></style>
