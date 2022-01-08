<template>
  <span>
    <template v-if="!hidden">
      <form enctype="multipart/form-data" novalidate>
        <!-- v-if="isInitial || isSaving"-->
        <div class="dropbox">
          <input
            type="file"
            :multiple="multiple"
            :name="uploadFieldName"
            :disabled="isSaving"
            @change="
              filesChange($event.target.name, $event.target.files)
              fileCount = $event.target.files.length
            "
            class="input-file"
            :accept="accept" />
          <!--accept="image/*"-->
          <p v-if="isInitial">
            Перетащите файл<span v-if="multiple">ы</span> на эту область<br />
            или нажмите для загрузки
          </p>
          <p v-if="isSuccess">
            Файлы загружены!<br />Если необходимо, загрузите ещё.
          </p>
          <p v-if="isSaving">Загрузка файлов...</p>
        </div>
      </form>
    </template>
    <template v-else>
      <input
        type="file"
        :multiple="multiple"
        :name="uploadFieldName"
        :disabled="isSaving"
        :accept="accept"
        @change="
          filesChange($event.target.name, $event.target.files)
          fileCount = $event.target.files.length
        "
        class="input-file-hidden" />
    </template>
  </span>
</template>

<script>
import axios from "axios"
const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3

export default {
  props: {
    url: { required: true },
    uploadFieldName: { default: "files" },
    hidden: { default: false },
    multiple: { default: false },
    url_is_absolute: { default: false },
    accept: { default: "*" },
  },
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
    }
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED
    },
  },
  methods: {
    hit() {
      this.$el.getElementsByTagName("input")[0].click()
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL
      this.uploadedFiles = []
      this.uploadError = null
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING
      var config = {}
      if (this.url_is_absolute) {
        config["baseURL"] = ""
      }
      axios
        .post(this.url, formData, config)
        .then((x) => x.data)
        .then((x) => {
          this.uploadedFiles = [].concat(x)
          this.currentStatus = STATUS_SUCCESS
          setTimeout(() => {
            this.$emit("success", this.uploadedFiles)
          }, 100)
        })
        .catch((err) => {
          console.log("shme")
          this.uploadError = err.response
          this.currentStatus = STATUS_FAILED
          this.$emit("fail", this.uploadError)
        })
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData()
      if (!fileList.length) return
      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(fieldName, fileList[x], fileList[x].name)
      })
      // save it
      this.save(formData)
    },
  },
  mounted() {
    this.reset()
  },
  watch: {
    currentStatus(v) {
      this.$emit("status", v)
    },
  },
}
</script>

<style>
.dropbox {
  outline: 2px dashed grey;
  outline-offset: -10px;
  padding: 10px 10px;
  min-height: 100px;
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 100px;
  position: absolute;
  cursor: pointer;
}

.input-file-hidden {
  display: none;
}

.dropbox:hover {
  background: #c4e3f3;
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 30px 0 20px 0;
}
</style>
