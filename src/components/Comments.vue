<template>
  <div>
    <div class="mt-4">
      <b-card
        v-for="comment in article.comments"
        :key="comment.id"
        class="mt-2">
        <span>
          <b-badge
            :variant="
              comment.author.role == 'MODERATOR' ||
              comment.author.role == 'ADMIN'
                ? 'warning'
                : 'primary'
            ">
            {{ roles[comment.author.role] }}
          </b-badge>
          <strong>{{ comment.author.fio }}</strong>
        </span>
        <p>
          <i>{{ comment.datetime | dateFormat }}</i>
        </p>
        <p>{{ comment.text }}</p>
      </b-card>
      <b-button v-if="new_comment.text == null" class="mt-4" @click="newComment"
        >Новый комментарий</b-button
      >
    </div>
    <div class="mt-2" v-if="new_comment.text != null">
      <b-form-textarea
        v-model="new_comment.text"
        placeholder="Напишите комментарий">
      </b-form-textarea>
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
import moment from "moment"
import format from "moment"

export default {
  props: ["article"],
  data() {
    return {
      new_comment: {
        article: this.article.id,
        text: null,
      },
      roles: {
        MODERATOR: "Модератор",
        ADMIN: "Администратор",
        WRITER: "Автор",
      },
    }
  },
  computed: {},
  filters: {
    dateFormat(date) {
      return moment(String(date)).format("DD.MM.YYYY HH:mm")
    },
  },
  methods: {
    newComment() {
      this.new_comment.text = ""
    },
    createComment() {
      if (this.new_comment.text != false) {
        return api.media.newComment(this.new_comment).then((data) => {
          this.new_comment.text = null
          this.$emit("create")
        })
      }
    },
  },
}
</script>

<style scoped></style>
