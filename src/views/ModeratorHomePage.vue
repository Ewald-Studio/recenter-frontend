<template>
  <b-container fluid>
    <b-row class="mt-4">
      <b-col cols="4">
        <b-list-group>
          <b-list-group-item
            v-for="article in articles"
            :key="article.id"
            @click="changeArticle(article)"
            class="article-list-item"
            :active="isSelected(article)">
            <div>
              <b-badge :variant="isSelected(article) ? 'light' : 'warning'"
                >На модерации</b-badge
              >
            </div>
            <span v-if="article.title">{{ article.title }}</span>
            <i v-else>Без названия</i>
            <!-- {{ article.status }} -->
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col>
        <moderator-article
          v-if="selected_article"
          :article="selected_article"
          v-on:update-list="getArticles"></moderator-article>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div><b-link :to="{ name: 'LoginPage' }">Выйти</b-link></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import api from "@/api"
import ModeratorArticle from "./Moderator/ModeratorArticle.vue"

export default {
  data() {
    return {
      articles: null,
      selected_article: null,
    }
  },
  components: {
    ModeratorArticle,
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
    isSelected(article) {
      return this.selected_article && this.selected_article.id == article.id
    },
  },
}
</script>
