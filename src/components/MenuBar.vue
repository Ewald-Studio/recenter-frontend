<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand href="#">Ресурсный Центр</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <!-- <b-navbar-nav>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item>
      </b-navbar-nav> -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item>{{ userProfile.fio }}</b-nav-item>
        <b-nav-item @click="exit">Выйти</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { logout } from "@/api/auth"
import { mapState } from "vuex"
export default {
  computed: {
    ...mapState(["userProfile"]),
  },
  methods: {
    exit() {
      logout()
      this.$router.replace({ name: "LoginPage" })
    },
  },
}
</script>
