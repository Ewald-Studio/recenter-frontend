<template>
  <div>
    <div class="mt-4">
      <div
        v-for="comment in article.comments"
        :key="comment.id"
        class="mt-2 mb-4">
        <span>
          <b-badge
            class="mr-2"
            :variant="
              comment.author.role == 'MODERATOR' ||
              comment.author.role == 'ADMIN'
                ? 'warning'
                : 'primary'
            ">
            {{ roles[comment.author.role] }}
          </b-badge>
          <strong class="mr-2">{{ comment.author.fio }}</strong>
          <i>
            <small>{{ comment.datetime | dateFormat }}</small>
          </i>
        </span>
        <p class="mt-2">{{ comment.text }}</p>
      </div>
      <b-button
        v-if="new_comment.text == null"
        class="mt-4"
        variant="outline-info"
        size="sm"
        @click="newComment">
        Новый комментарий
      </b-button>
    </div>
    <div class="mt-2" v-if="new_comment.text != null">
      <b-form-textarea
        v-model="new_comment.text"
        placeholder="Напишите комментарий">
      </b-form-textarea>
      <br />
      <b-button
        variant="info"
        size="sm"
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
// import format from "moment"

export default {
  props: ["article"],
  data() {
    return {
      new_comment: {
        article: this.article.id,
        text: "",
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
        return api.media.newComment(this.new_comment).then(() => {
          this.new_comment.text = ""
          this.$emit("create")
        })
      }
    },
  },
}
</script>

<style scoped></style>
