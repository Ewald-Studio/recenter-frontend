<template>
  <b-container fluid>
    <b-row class="mt-4">
      <b-col cols="4">
        <b-list-group>
          <b-list-group-item>
            <b-link @click="newArticle">
              <b-icon-plus-circle></b-icon-plus-circle>
              Новая публикация
            </b-link>
          </b-list-group-item>
          <b-list-group-item
            v-for="article in articles"
            :key="article.id"
            @click="changeArticle(article)"
            class="article-list-item"
            :active="isSelected(article)">
            <div>
              <b-badge
                v-if="article.status == 'NEW'"
                :variant="isSelected(article) ? 'light' : 'primary'"
                >Новая</b-badge
              >
              <b-badge
                v-else-if="article.status == 'MODERATION'"
                :variant="isSelected(article) ? 'light' : 'warning'"
                >На модерации</b-badge
              >
              <b-badge
                v-else-if="article.status == 'REJECTED'"
                :variant="isSelected(article) ? 'light' : 'danger'"
                >Требует доработки</b-badge
              >
              <b-badge
                v-else-if="article.status == 'APPROVED'"
                :variant="isSelected(article) ? 'light' : 'success'"
                >Опубликовано</b-badge
              >
            </div>
            <span v-if="article.title">{{ article.title }}</span>
            <i v-else>Без названия</i>
            <!-- {{ article.status }} -->
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col>
        <writer-article
          v-if="selected_article"
          :article="selected_article"
          v-on:update-list="getArticles"></writer-article>
      </b-col>
    </b-row>
  </b-container>
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
    newArticle() {
      return api.media
        .newArticle()
        .then((data) => this.changeArticle(data))
        .then(() => this.getArticles())
    },
    isSelected(article) {
      return this.selected_article && this.selected_article.id == article.id
    },
  },
}
</script>

<style scoped>
.article-list-item {
  cursor: pointer;
}
</style>
