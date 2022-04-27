<template>
  <div>
    <b-col :cols="6" :offset="3" class="mt-4 mb-4">
      <auto-form
        v-if="userProfile"
        url="orgstructure/organizations/"
        :object-id="userProfile.organization.id"
        @submit="showSubmitModal"
        :autosave="false"
        :exclude="['logo', 'photo', 'is_staff']"
        :editors="['description']"
        submit-button-text="Сохранить"></auto-form>
    </b-col>
  </div>
</template>

<script>
import { mapState } from "vuex"
import AutoForm from "../components/AutoForm/AutoForm.vue"
export default {
  components: { AutoForm },
  computed: {
    ...mapState(["userProfile"]),
  },
  methods: {
    showSubmitModal() {
      alert("Изменения сохранены")
    },
  },
}
</script>
