import Vue from "vue"
import VueRouter from "vue-router"
import LoginPage from "../views/LoginPage.vue"
import WriterHomePage from "../views/WriterHomePage.vue"
import ModeratorHomePage from "../views/ModeratorHomePage.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/writer/home",
    name: "WriterHomePage",
    component: WriterHomePage,
  },
  {
    path: "/moderator/home",
    name: "ModeratorHomePage",
    component: ModeratorHomePage,
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
