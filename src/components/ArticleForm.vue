<template>
  <div>
    <!-- Форма -->
    <div>
      <b-input
        :disabled="!articleIsEditable"
        size="lg"
        v-model="article.title"
        placeholder="Заголовок">
      </b-input>
      <b-textarea
        :disabled="!articleIsEditable"
        class="mt-2"
        v-model="article.annotation"
        placeholder="Краткая аннотация"></b-textarea>
      <vue-editor
        class="mt-2"
        :disabled="!articleIsEditable"
        :editorToolbar="articleIsEditable ? customToolbar : [[]]"
        v-model="article.text">
      </vue-editor>
      <multiselect
        :disabled="!articleIsEditable"
        multiple
        class="mt-2"
        v-model="article.sections"
        :options="sections.map((section) => section.id)"
        :custom-label="(opt) => sections.find((x) => x.id == opt).name"
        placeholder="Разделы">
      </multiselect>
      <b-textarea
        :disabled="!articleIsEditable"
        class="mt-2"
        placeholder="Вопросы"
        v-model="article.questions">
        {{ article.questions }}
      </b-textarea>
      <b-input
        :disabled="!articleIsEditable"
        class="mt-2"
        v-model="article.video"
        placeholder="Ссылка на видео на YouTube">
      </b-input>
      <b-input
        :disabled="!articleIsEditable"
        class="mt-2"
        v-model="article.authorship"
        placeholder="ФИО и должность автора публикации">
      </b-input>
      <b-card class="mt-2" v-if="articleIsEditable || article.files.length">
        <file-upload
          ref="fileupload"
          :hidden="true"
          :multiple="true"
          v-if="articleIsEditable"
          upload-field-name="files"
          :url="`/media/articles/${article.id}/upload/`"
          accept="application/pdf"
          @success="propagateUpdate">
        </file-upload>
        <div v-if="articleIsEditable">
          <b-btn
            @click="hitFileUpload"
            variant="outline-info"
            size="sm"
            :disabled="!articleIsEditable"
            >Загрузить файлы к публикации</b-btn
          >
        </div>
        <files-list
          v-if="article.files && article.files.length"
          class="mt-1"
          :files="article.files"
          :isEditable="articleIsEditable"
          @update="propagateUpdate">
        </files-list>
      </b-card>
    </div>
    <!-- Комментарии -->
    <b-card
      class="mt-2"
      title="Комментарии"
      v-if="
        articleIsEditable ||
        (article.comments && article.comments.length > 0) ||
        userProfile.role == 'MODERATOR'
      ">
      <comments :article="article" @create="propagateUpdate"></comments>
    </b-card>
    <!-- Кнопочки -->
    <div class="mt-4 mb-4" align="right">
      <b-button
        v-if="article.status == 'NEW' || article.status == 'REJECTED'"
        @click="deleteArticle"
        variant="link text-danger">
        Удалить
      </b-button>
      <!-- <b-button
        class="ml-2"
        v-if="article.status == 'NEW' || article.status == 'REJECTED'"
        @click="saveArticle"
        variant="success">
        Сохранить
      </b-button> -->
      <b-button
        class="ml-2"
        v-if="article.status == 'NEW' || article.status == 'REJECTED'"
        @click="saveArticleAndSendToModeration"
        variant="primary">
        Отправить на модерацию
      </b-button>

      <template v-if="article.status == 'MODERATION'">
        <i v-if="userProfile && userProfile.role == 'WRITER'">
          Публикация на модерации
        </i>
        <div v-else>
          <b-button @click="rejectArticle" variant="outline-danger">
            Вернуть на доработку
          </b-button>
          <b-button
            class="ml-2"
            @click="approveArticle"
            variant="outline-success">
            Опубликовать
          </b-button>
        </div>
      </template>

      <i v-if="article.status == 'DELETED'">Публикация удалена</i>
    </div>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import Multiselect from "vue-multiselect"
import FileUpload from "@/components/FileUpload"
import FilesList from "@/components/FilesList"
import Comments from "@/components/Comments"
// import map from "lodash/map"
import { mapState } from "vuex"
import api from "@/api"
import Debouncer from "@/api/debouncer"

export default {
  components: {
    VueEditor,
    Multiselect,
    FileUpload,
    FilesList,
    Comments,
  },
  props: ["article"],
  data() {
    return {
      customToolbar: [
        [{ header: [false, 1, 2, 3] }],
        ["bold", "italic"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image", "link", "video"],
      ],
    }
  },
  computed: {
    ...mapState(["sections", "questions", "userProfile"]),
    articleIsEditable() {
      return (
        this.userProfile &&
        this.userProfile.role == "WRITER" &&
        (this.article.status == "NEW" || this.article.status == "REJECTED")
      )
    },
  },
  methods: {
    updateArticle() {
      Debouncer.execDelayed(
        () => api.media.saveArticle(this.article),
        1000,
        "save-article",
      )
    },
    saveArticle() {
      return api.media
        .saveArticle(this.article)
        .then(() => this.propagateUpdate())
    },
    saveArticleAndSendToModeration() {
      const message =
        "Отправить публикацию на модерацию? В ходе модерации редактирование публикации невозможно."
      if (confirm(message)) {
        this.article.status = "MODERATION"
        return this.saveArticle(this.article)
        // .then((data) => api.media.sendToModeration(this.article.id))
        // .then(() => {
        //   this.$emit("update")
        //   this.article.status = "MODERATION"
        // })
      }
    },
    deleteArticle() {
      if (confirm("Вы действительно хотите удалить эту публикацию?")) {
        this.article.status = "DELETED"
        return this.saveArticle(this.article)
        // return this.saveArticle(this.article)
        //   .then((data) => api.media.deleteArticle(this.article.id))
        //   .then(() => {
        //     this.$emit("deleted")
        //     this.article.status = "DELETED"
        //   })
      }
    },
    approveArticle() {
      if (confirm("Подтвердите публикацию статьи")) {
        this.article.status = "APPROVED"
        return this.saveArticle(this.article)
      }
    },
    rejectArticle() {
      if (confirm("Вернуть публикацию на доработку?")) {
        this.article.status = "REJECTED"
        return this.saveArticle(this.article)
      }
    },
    hitFileUpload() {
      this.$refs["fileupload"].hit()
    },
    propagateUpdate() {
      this.$emit("update", this.article)
    },
  },
  watch: {
    article: {
      deep: true,
      handler() {
        this.updateArticle()
      },
    },
  },
}
</script>

<style>
.ql-picker-item::before,
.ql-snow .ql-picker.ql-header .ql-picker-label::before {
  content: "Обычный" !important;
}
.ql-snow .ql-picker.ql-header {
  width: 120px !important;
}
.ql-picker-item[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before {
  content: "Заголовок 1" !important;
}
.ql-picker-item[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before {
  content: "Заголовок 2" !important;
}
.ql-picker-item[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before {
  content: "Заголовок 3" !important;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "Ссылка:" !important;
}
.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "Ссылка на видео:" !important;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  content: "ОК" !important;
}
.ql-editor p,
.ql-editor ul,
.ql-editor ol {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}
</style>
