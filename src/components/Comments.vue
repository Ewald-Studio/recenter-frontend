<template>
  <div>
    <div class="mt-4">
      <p v-for="comment in article.comments" :key="comment.id">
        {{ comment.text }}
      </p>
      <b-button v-if="new_comment.text == null" class="mt-4" @click="newComment"
        >Новый комментарий</b-button
      >
    </div>
    <div class="mt-2" v-if="new_comment.text != null">
      <textarea v-model="new_comment.text" placeholder="Напишите комментарий">
      </textarea>
      <br />
      <b-button
        @click="createComment"
        :disabled="new_comment.text ? false : true">
        <span>Добавить комментарий</span>
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
    newComment() {
      this.new_comment.text = ""
    },
    createComment() {
      if (this.new_comment.text != false) {
        return api.media.newComment(this.new_comment).then((data) => {
          this.new_comment.text = null
          this.$emit("update-comment")
          console.log("comment")
        })
      }
    },
  },
}
</script>

<style scoped></style>
