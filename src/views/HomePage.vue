<template>
  <b-container fluid>
    <template v-if="firstTimeLoading">
      <div class="text-center mt-4">
        <b-spinner></b-spinner>
      </div>
    </template>
    <template v-else-if="!articlesList || !articlesList.length">
      <div class="text-center mt-4">
        <h3 class="text-muted">Публикаций нет</h3>
        <p>
          <create-article-button
            v-if="userProfile && userProfile.role == 'WRITER'"
            @created="updateArticle"></create-article-button>
        </p>
      </div>
    </template>
    <template v-else>
      <b-row class="mt-4">
        <b-col cols="4">
          <articles-list
            :articles-list="articlesList"
            @selected="selectArticle"
            @created="updateArticle"
            v-if="articlesList"></articles-list>
        </b-col>
        <b-col cols="8">
          <article-form
            @update="updateArticle"
            :article="selectedArticle"
            v-if="selectedArticle"></article-form>
        </b-col>
      </b-row>
    </template>
  </b-container>
</template>

<script>
import api from "@/api"
import find from "lodash/find"
import { mapState } from "vuex"

import ArticlesList from "../components/ArticlesList"
import ArticleForm from "../components/ArticleForm"
import CreateArticleButton from "../components/CreateArticleButton.vue"

export default {
  components: {
    ArticlesList,
    ArticleForm,
    CreateArticleButton,
  },
  data() {
    return {
      articlesList: null,
      selectedArticle: null,
      firstTimeLoading: true,
    }
  },
  computed: {
    ...mapState(["userProfile"]),
  },
  mounted() {
    this.fetchArticlesList()
  },
  methods: {
    fetchArticlesList() {
      return api.media.articles().then((data) => {
        this.articlesList = data
        this.firstTimeLoading = false
      })
    },
    selectArticle(article) {
      this.selectedArticle = article
    },
    updateArticle(article) {
      const article_id = article.id
      console.log(article_id)
      this.fetchArticlesList().then(() => {
        this.selectedArticle = find(
          this.articlesList,
          (i) => i.id == article_id,
        )
      })
    },
  },
}
</script>
