<template>
  <div>
    <b-input v-model="article.title" placeholder="Заголовок"> </b-input>
    <b-textarea v-model="article.text" placeholder="Текст"> </b-textarea>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      default: {
        text: "",
        article: "null",
        status: "NEW",
      },
    },
  },
  data() {
    return {}
  },
}
</script>

<style></style>
