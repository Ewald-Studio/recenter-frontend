<template>
  <div>
    <b-list-group>
      <b-list-group-item v-if="userProfile.role == 'WRITER'">
        <create-article-button
          @created="createdArticle"></create-article-button>
      </b-list-group-item>
      <b-list-group-item
        v-for="article in articlesList"
        :key="article.id"
        @click="selectArticle(article)"
        class="article-list-item"
        :active="isSelected(article)">
        <articles-list-item
          :article="article"
          :selected="isSelected(article)"></articles-list-item>
      </b-list-group-item>
      <div class="mt-2" align="center">
        <refresh-articles-list-button
          @update="refreshArticlesList"></refresh-articles-list-button>
      </div>
    </b-list-group>
  </div>
</template>

<script>
// import api from "@/api"
// import find from "lodash/find"
import { mapState } from "vuex"

import CreateArticleButton from "@/components/CreateArticleButton"
import ArticlesListItem from "@/components/ArticlesListItem"
import RefreshArticlesListButton from "./RefreshArticlesListButton.vue"

export default {
  components: {
    CreateArticleButton,
    ArticlesListItem,
    RefreshArticlesListButton,
  },
  props: ["articlesList"],
  data() {
    return {
      selectedArticle: null,
    }
  },
  computed: {
    ...mapState(["userProfile"]),
  },
  methods: {
    createdArticle(article) {
      this.$emit("created", article)
    },
    selectArticle(article) {
      this.selectedArticle = article
      this.$emit("selected", article)
    },
    isSelected(article) {
      return this.selectedArticle && this.selectedArticle.id == article.id
    },
    refreshArticlesList() {
      this.$emit("update-list")
    },
  },
}
</script>

<style scoped>
.article-list-item {
  cursor: pointer;
}
</style>
