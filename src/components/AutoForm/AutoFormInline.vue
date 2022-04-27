<template>
  <div>
    <b-card v-for="obj in objects" class="mb-2 mt-2">
      <auto-form
        :url="url"
        :object-id="obj.id"
        :initial-data="obj"
        @submit="onFormSubmit"
        @updated="onObjectUpdated"
        :hide-labels="hideLabels"
        :foreign-keys="foreignKeys"
        :exclude="exclude"
        :autosave="autosave"
        :submit-button-text="submitButtonText">
      </auto-form>
      <b-button
        pill
        size="sm"
        variant="outline-danger"
        class="delete-object-button"
        style=""
        @click="deleteObject(obj.id)">
        <b-icon-x></b-icon-x>
      </b-button>
    </b-card>

    <p class="text-center mt-3 mb-4">
      <b-btn variant="outline-info" size="sm" @click="createObject">
        <b-icon-plus-circle></b-icon-plus-circle>
        {{ createButtonText }}
      </b-btn>
    </p>
  </div>
</template>

<script>
import axios from "axios"
import each from "lodash/each"
import map from "lodash/map"
import pickBy from "lodash/pickBy"

import Debouncer from "@/api/debouncer"

export default {
  name: "AutoFormInline",
  components: {
    AutoForm: () => import("./AutoForm.vue"),
  },
  props: {
    url: String,
    submitButtonText: {
      type: String,
      default: "Сохранить",
    },
    createButtonText: {
      type: String,
      default: "Добавить",
    },
    exclude: {
      type: Array,
      default: () => {
        return []
      },
    },
    hideLabels: {
      type: Array,
      default: () => {
        return []
      },
    },
    foreignKeys: {
      type: Object,
      default: () => {
        return {}
      },
    },
    autosave: {
      type: Boolean,
      default: false,
    },
    initialDataForCreate: {
      type: Object,
      default: () => {
        return {}
      },
    },
    urlParams: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      objects: [],
    }
  },
  mounted() {
    this.fetchObjects()
  },
  methods: {
    fetchObjects() {
      return axios
        .get(this.url, { params: this.urlParams })
        .then((response) => (this.objects = response.data))
    },
    createObject() {
      return axios
        .post(this.url, this.initialDataForCreate)
        .then(this.fetchObjects)
    },
    deleteObject(id) {
      return axios.delete(`${this.url}${id}/`).then(this.fetchObjects)
    },
    onFormSubmit(data) {
      this.$emit("submit", data)
    },
    onObjectUpdated(data) {
      this.$emit("updated", data)
    },
    onObjectCreated(data) {
      this.$emit("created", data)
    },
    onObjectDeleted(data) {
      this.$emit("deleted", data)
    },
  },
}
</script>

<style scoped>
.delete-object-button {
  top: 3px;
  right: 3px;
  position: absolute;
  border: 0;
}
</style>
