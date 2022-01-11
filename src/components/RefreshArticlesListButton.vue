<template>
  <b-button variant="light" @click="refreshArticlesList">
    <b-icon-arrow-repeat></b-icon-arrow-repeat>
    Обновить список
  </b-button>
</template>

<script>
export default {
  methods: {
    refreshArticlesList() {
      this.$emit("update")
    },
  },
}
</script>
