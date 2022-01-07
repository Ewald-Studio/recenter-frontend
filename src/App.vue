<template>
  <div>
    <menu-bar v-if="profile"></menu-bar>
    <router-view />
  </div>
</template>

<script>
import { isAuthenticated, reauthenticate } from "@/api/auth"
import MenuBar from "./components/MenuBar.vue"
import { mapState, mapActions } from "vuex"

export default {
  components: { MenuBar },
  name: "App",
  computed: {
    ...mapState(["profile"]),
  },
  mounted() {
    if (isAuthenticated()) {
      reauthenticate()
        .then(() => this.fetchSections())
        .then(() => this.fetchQuestions())
    } else {
      if (this.$router.currentRoute.name != "LoginPage") {
        this.$router.replace({ name: "LoginPage" })
      }
    }
  },
  methods: {
    ...mapActions(["fetchSections", "fetchQuestions"]),
  },
}
</script>
