<template>
  <div>
    <menu-bar v-if="profile"></menu-bar>
    <router-view />
  </div>
</template>

<script>
import { isAuthenticated, reauthenticate } from "@/api/auth"
import MenuBar from "./components/MenuBar.vue"
import { mapState } from "vuex"

export default {
  components: { MenuBar },
  name: "App",
  computed: {
    ...mapState(["profile"]),
  },
  mounted() {
    if (isAuthenticated()) {
      reauthenticate()
    } else {
      if (this.$router.currentRoute.name != "LoginPage") {
        this.$router.replace({ name: "LoginPage" })
      }
    }
  },
}
</script>
