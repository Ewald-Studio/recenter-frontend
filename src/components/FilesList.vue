<template>
  <div>
    <div class="file-item" v-for="file in files" :key="file[keyFieldName]">
      <b-icon-file-earmark class="mr-1"></b-icon-file-earmark>
      <b-link :href="file[urlFieldName]" target="_blank"
        >{{ file[labelFieldName] ? file[labelFieldName] : "Без названия" }}
      </b-link>
      <b-button
        size="sm"
        variant="link text-danger"
        @click="removeFile(file.id)"
        v-if="isEditable && userProfile.role == 'WRITER'">
        <b-icon-x></b-icon-x>
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { mapState } from "vuex"

export default {
  props: {
    files: { required: true },
    labelFieldName: { default: "name" },
    urlFieldName: { default: "file" },
    keyFieldName: { default: "id" },
    isEditable: { default: false },
  },
  computed: {
    ...mapState(["userProfile"]),
  },
  methods: {
    removeFile(file_id) {
      if (confirm("Удалить файл?")) {
        return axios
          .delete("/media/articlefiles/" + file_id + "/")
          .then(() => this.$emit("update"))
      }
    },
  },
}
</script>
