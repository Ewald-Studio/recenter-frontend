<template>
  <div>
    <menu-bar v-if="userProfile"></menu-bar>
    <router-view />
  </div>
</template>

<script>
import { isAuthenticated, reauthenticate } from "@/api/auth"
import { mapState, mapActions } from "vuex"
import MenuBar from "./components/MenuBar.vue"

export default {
  components: { MenuBar },
  name: "App",
  computed: {
    ...mapState(["userProfile"]),
  },
  mounted() {
    if (isAuthenticated()) {
      reauthenticate()
        .then(() => {
          if (this.$router.currentRoute.name != "HomePage") {
            this.$router.replace({ name: "HomePage" })
          }
        })
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
