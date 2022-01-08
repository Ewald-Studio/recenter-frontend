<template>
  <div>
    <div>
      <b-input v-model="article.title" placeholder="Заголовок"> </b-input>
      <b-textarea class="mt-2" v-model="article.text" placeholder="Текст">
      </b-textarea>
    </div>

    <comments :article="article" @update-comment="refetchArticle"></comments>

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
import Comments from "../../components/Comments.vue"

export default {
  components: { Comments },
  props: ["article"],
  data() {
    return {}
  },
  methods: {
    rejectArticle() {
      if (confirm("Вернуть на доработку?")) {
        this.article.comments.push(this.new_comment)
        return api.media
          .rejectArticle(this.article.id)
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
    refetchArticle() {
      this.$emit("update-article", this.article.id)
      console.log("article")
    },
  },
}
</script>

<style></style>
