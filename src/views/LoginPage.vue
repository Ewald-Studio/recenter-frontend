<template>
  <b-container fluid>
    <b-row>
      <b-col offset="3" cols="6">
        <b-card class="mt-4">
          <b-input v-model="username" placeholder="Имя пользователя"></b-input>
          <b-input
            class="mt-2"
            v-model="password"
            placeholder="Пароль"
            type="password"></b-input>
          <b-button class="mt-2" @click="login" variant="primary">
            Войти
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import axios from "axios"
import api from "@/api"
import { authenticate } from "@/api/auth"
import { mapActions } from "vuex"

export default {
  data() {
    return {
      username: "",
      password: "",
    }
  },
  methods: {
    ...mapActions(["fetchSections", "fetchQuestions"]),
    login() {
      return api.orgstructure
        .login(this.username, this.password)
        .then((data) => {
          console.log(data)
          return authenticate(data)
        })
        .then(() => this.fetchSections())
        .then(() => this.fetchQuestions())
        .then(() => {
          this.$router.push({ name: "HomePage" })
        })
        .catch(() => alert("Неудачная попытка входа"))
    },
  },
}
</script>
