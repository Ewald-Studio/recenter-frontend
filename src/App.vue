<template>
  <router-view />
</template>

<script>
import { isAuthenticated, reauthenticate } from "@/api/auth"

export default {
  name: "App",
  mounted() {
    if (isAuthenticated()) {
      reauthenticate()
    } else {
      this.$router.replace({ name: "LoginPage" })
    }
  },
}
</script>
