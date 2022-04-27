<template>
  <div>
    <b-form>
      <div
        v-for="(part, index) in partedFormSchema"
        :class="{ hidden: index != activePart }"
        :key="index">
        <!-- Title -->
        <h4 v-if="part.title" class="mb-3">{{ part.title }}</h4>
        <div v-if="part.description" v-html="part.description"></div>
        <!-- Part -->
        <template v-for="(item, key) in part.schema">
          <template
            v-if="item.read_only == false && exclude.indexOf(key) == -1">
            <b-form-group
              v-if="item.type != 'boolean'"
              :id="`${key}-${objectId ? objectId : 'new'}-group`"
              :key="`${key}-${objectId ? objectId : 'new'}-group-key`"
              :label="hideLabels.indexOf(key) == -1 ? item.label : ''"
              :label-for="key">
              <!-- String -->
              <b-form-input
                v-if="
                  item.type == 'string' &&
                  item.max_length &&
                  editors.indexOf(key) == -1
                "
                :id="`${key}-${objectId ? objectId : 'new'}`"
                v-model="formData[key]"
                type="text"
                :required="item.required == true"
                autocomplete="off">
              </b-form-input>

              <!-- Text -->
              <b-form-textarea
                v-if="
                  item.type == 'string' &&
                  !item.max_length &&
                  editors.indexOf(key) == -1
                "
                :id="`${key}-${objectId ? objectId : 'new'}`"
                v-model="formData[key]"
                type="text"
                :rows="5"
                :required="item.required == true"
                autocomplete="off">
              </b-form-textarea>

              <!-- Editor -->
              <vue-editor
                v-if="
                  item.type == 'string' &&
                  !item.max_length &&
                  editors.indexOf(key) != -1
                "
                class="mt-2"
                :editorToolbar="editorToolbar"
                v-model="formData[key]"></vue-editor>

              <!-- Number -->
              <b-form-input
                v-if="item.type == 'integer'"
                :id="`${key}-${objectId ? objectId : 'new'}`"
                v-model="formData[key]"
                type="number"
                :required="item.required == true"
                autocomplete="off">
              </b-form-input>

              <!-- Date -->
              <b-form-datepicker
                v-if="item.type == 'date'"
                :id="`${key}-${objectId ? objectId : 'new'}`"
                v-model="formData[key]"
                :required="item.required == true"
                placeholder="Выберите дату"
                locale="ru-RU"
                :start-weekday="1"
                autocomplete="off">
              </b-form-datepicker>

              <!-- Choice -->
              <b-form-select
                v-if="item.type == 'choice'"
                :id="`${key}-${objectId ? objectId : 'new'}`"
                :options="
                  item.choices.map((i) => ({
                    value: i.value,
                    text: i.display_name,
                  }))
                "
                v-model="formData[key]">
              </b-form-select>

              <!-- Field -->
              <b-form-select
                v-if="item.type == 'field'"
                :id="`${key}-${objectId ? objectId : 'new'}`"
                :options="foreignKeyData[key]"
                v-model="formData[key]">
              </b-form-select>
            </b-form-group>

            <b-form-group
              v-if="item.type == 'boolean'"
              :id="key"
              :key="`${key}-${objectId ? objectId : 'new'}-group-key`">
              <!-- Checkbox (boolean) -->
              <b-form-checkbox
                v-if="item.type == 'boolean'"
                :id="`${key}-${objectId ? objectId : 'new'}`"
                v-model="formData[key]"
                :required="item.required == true"
                autocomplete="off">
                {{ item.label }}
              </b-form-checkbox>
            </b-form-group>
          </template>
        </template>
        <div
          v-if="part.inlines"
          v-for="(inline, key) in part.inlines"
          :key="`inline-${key}`">
          <auto-form-inline
            v-bind="inline"
            :autosave="autosave"></auto-form-inline>
        </div>
      </div>

      <b-row v-if="parts" class="mt-4">
        <b-col>
          <b-btn variant="link" v-if="activePart > 0" @click="activePart--">
            <b-icon-arrow-left></b-icon-arrow-left>
            {{ parts[activePart - 1].title }}
          </b-btn>
        </b-col>
        <b-col class="text-right" v-if="activePart < parts.length - 1">
          <b-btn variant="link" @click="activePart++">
            {{ parts[activePart + 1].title }}
            <b-icon-arrow-right></b-icon-arrow-right>
          </b-btn>
        </b-col>
        <b-col class="text-right" v-if="activePart == parts.length - 1">
          <b-btn variant="success" @click="finishForm">
            {{ submitButtonText }}
          </b-btn>
        </b-col>
      </b-row>

      <b-form-group v-if="!autosave" class="mt-4">
        <b-btn variant="success" @click="submitForm">{{
          submitButtonText
        }}</b-btn>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import axios from "axios"
import each from "lodash/each"
import map from "lodash/map"
import pickBy from "lodash/pickBy"
import { VueEditor } from "vue2-editor"

import { mapActions, mapState } from "vuex"
import AutoFormInline from "./AutoFormInline.vue"

import Debouncer from "@/api/debouncer"

export default {
  name: "AutoForm",
  components: {
    AutoFormInline,
    VueEditor,
  },
  props: {
    url: String,
    objectId: {
      type: Number | null,
      default: null,
    },
    initialData: {
      type: Object | null,
      default: null,
    },
    submitButtonText: {
      type: String,
      default: "Submit",
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
    inlines: {
      type: Object,
      default: () => {
        return {}
      },
    },
    parts: {
      type: Array | null,
      default: null,
    },
    editors: {
      type: Array,
      default: () => {
        return []
      },
    },
    autosave: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formSchema: null,
      formData: {},
      foreignKeyData: {},
      initialAutosaveSkipped: false,
      activePart: 0,
      editorToolbar: [
        ["bold", "italic"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image", "link", "video"],
      ],
    }
  },
  computed: {
    ...mapState(["autoFormSchemas"]),
    objectURL() {
      if (this.objectId) {
        return this.url + this.objectId + "/"
      } else return null
    },
    partedFormSchema() {
      if (this.formSchema == null) return null
      if (this.parts == null) {
        return [
          {
            title: "",
            fields: map(this.formSchema, (val, key) => key),
            schema: this.formSchema,
            inlines: this.inlines,
          },
        ]
      } else {
        return map(this.parts, (part) => ({
          title: part.title,
          description: part.description,
          fields: part.fields,
          inlines: part.inlines
            ? pickBy(
                this.inlines,
                (val, key) => part.inlines.indexOf(key) != -1,
              )
            : [],
          schema: pickBy(
            this.formSchema,
            (val, key) => part.fields.indexOf(key) != -1,
          ),
        }))
      }
    },
  },
  mounted() {
    this.fetchFormSchema(this.url).then(() => {
      this.formSchema = this.autoFormSchemas[this.url]
      this.preloadFormData()
    })
  },
  methods: {
    ...mapActions(["fetchFormSchema"]),
    preloadFormData() {
      var promises = []
      each(this.formSchema, (i, key) => {
        if (i.type == "field" && this.exclude.indexOf(key) == -1) {
          promises.push(
            axios.get(this.foreignKeys[key].url).then((response) => {
              const option = map(response.data, (i) => ({
                value: i[this.foreignKeys[key].value],
                text: i[this.foreignKeys[key].text],
              }))
              this.$set(this.foreignKeyData, key, option)
            }),
          )
        }
      })
      return Promise.all(promises).then(() => {
        if (this.objectId != null) {
          if (this.initialData) {
            this.formData = this.initialData
          } else {
            return axios.get(this.objectURL).then((response) => {
              this.formData = response.data
            })
          }
        }
      })
    },
    showSubmitModal() {
      this.$refs.submitModal.show()
    },
    submitForm() {
      if (this.objectId) {
        // Patching existing object
        return axios
          .patch(this.objectURL, this.formData)
          .then((response) => {
            this.$emit("submit", this.formData)
            this.$emit("updated", response)
          })
          .catch((error) => {
            this.$emit("error", error)
          })
      } else {
        // Creating new object
        return axios
          .post(this.url, this.formData)
          .then((response) => {
            this.$emit("submit", this.formData)
            this.$emit("created", response)
          })
          .catch((error) => {
            this.$emit("error", error)
          })
      }
    },
    finishForm() {
      this.$emit("finish", this.formData)
    },
    autosaveForm() {
      Debouncer.execDelayed(this.submitForm, 2000, "save-form-" + this.objectId)
    },
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        if (this.autosave == true && this.objectId) {
          if (this.initialAutosaveSkipped == false)
            this.initialAutosaveSkipped = true
          else this.autosaveForm()
        }
      },
    },
  },
}
</script>

<style>
.hidden {
  display: none !important;
}
.form-group:last-child {
  margin-bottom: 0 !important;
}
</style>
