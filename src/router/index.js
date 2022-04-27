import Vue from "vue"
import VueRouter from "vue-router"
import LoginPage from "../views/LoginPage.vue"
import HomePage from "../views/HomePage.vue"
import AllArticlesPage from "../views/AllArticlesPage.vue"
import OrganizationPage from "../views/OrganizationPage.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/articles/",
    name: "AllArticlesPage",
    component: AllArticlesPage,
  },
  {
    path: "/organization/",
    name: "OrganizationPage",
    component: OrganizationPage,
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
