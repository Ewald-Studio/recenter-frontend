import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

import { BootstrapVue, IconsPlugin } from "bootstrap-vue"

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import axios from "axios"

axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.xsrfCookieName = "csrftoken"

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
