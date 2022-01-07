<template>
  <div>
    <div>
      <b-button-group vertical>
        <b-button
          v-for="article in articles"
          :key="article.id"
          @click="changeArticle(article)"
          >{{ article.title }} — {{ article.status }}</b-button
        >
      </b-button-group>
      <writer-article :article="selected_article"></writer-article>
    </div>
    <!-- <b-button @click="getArticles">get articlies</b-button> -->
  </div>
</template>

<script>
import api from "@/api"
import WriterArticle from "./Writer/WriterArticle.vue"

export default {
  data() {
    return {
      articles: null,
      selected_article: null,
    }
  },
  components: {
    WriterArticle,
  },
  mounted() {
    this.getArticles()
  },
  methods: {
    getArticles() {
      return api.media.articles().then((data) => (this.articles = data))
    },
    changeArticle(article) {
      this.selected_article = article
    },
  },
}
</script>
