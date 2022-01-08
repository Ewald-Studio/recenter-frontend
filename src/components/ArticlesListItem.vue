<template>
  <div>
    <div v-if="userProfile.role == 'WRITER'">
      <b-badge
        v-if="article.status == 'NEW'"
        :variant="selected ? 'light' : 'primary'"
        >Новая</b-badge
      >
      <b-badge
        v-else-if="article.status == 'MODERATION'"
        :variant="selected ? 'light' : 'warning'"
        >На модерации</b-badge
      >
      <b-badge
        v-else-if="article.status == 'REJECTED'"
        :variant="selected ? 'light' : 'danger'"
        >Требует доработки</b-badge
      >
      <b-badge
        v-else-if="article.status == 'APPROVED'"
        :variant="selected ? 'light' : 'success'"
        >Опубликовано</b-badge
      >
    </div>
    <div v-else-if="userProfile.role == 'MODERATOR'">
      <b-badge :variant="selected ? 'light' : 'primary'">
        {{ article.author.organization.name }}
      </b-badge>
    </div>
    <span v-if="article.title">{{ article.title }}</span>
    <i v-else>Без названия</i>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  props: ["article", "selected"],
  computed: {
    ...mapState(["userProfile"]),
  },
}
</script>
