<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand :to="{ name: 'HomePage' }">Ресурсный Центр</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <!-- <b-navbar-nav>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item>
      </b-navbar-nav> -->
      <b-navbar-nav class="ml-auto">
        <!-- <b-nav-item
          :to="{ name: 'HomePage' }"
          v-if="userProfile.role == 'MODERATOR'">
          Модерация
        </b-nav-item>
        <b-nav-item
          :to="{ name: 'AllArticlesPage' }"
          v-if="userProfile.role == 'MODERATOR'">
          Все публикации
        </b-nav-item> -->
        <b-nav-item :to="{ name: 'OrganizationPage' }">
          {{ userProfile.organization.name }}
        </b-nav-item>
        <!-- <b-nav-item>
          {{ fio_short }}
          <span v-if="userProfile.role == 'MODERATOR'">(модератор)</span>
        </b-nav-item> -->
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
    fio_short() {
      return (
        this.userProfile.fio.split(" ")[0] +
        " " +
        this.userProfile.fio.split(" ")[1][0] +
        ". " +
        this.userProfile.fio.split(" ")[2][0] +
        "."
      )
    },
  },
  methods: {
    exit() {
      logout()
      this.$router.replace({ name: "LoginPage" })
    },
  },
}
</script>
