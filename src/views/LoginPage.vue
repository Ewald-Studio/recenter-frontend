<template>
  <div>
    <b-card>
      <b-input v-model="username" placeholder="Имя пользователя"></b-input>
      <b-input
        v-model="password"
        placeholder="Пароль"
        type="password"
      ></b-input>
      <b-button @click="login">Войти</b-button>
    </b-card>
  </div>
</template>

<script>
// import axios from "axios"
import api from "@/api"
import { authenticate } from "@/api/auth"

export default {
  data() {
    return {
      username: "",
      password: "",
    }
  },
  methods: {
    login() {
      return api.orgstructure
        .login(this.username, this.password)
        .then((data) => {
          console.log(data)
          return authenticate(data)
        })
        .then(() => this.$router.push({ name: "HomePage" }))
        .catch(() => alert("Неудачная попытка входа"))
    },
  },
}
</script>
