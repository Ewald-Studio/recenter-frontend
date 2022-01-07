import axios from "axios"
import store from "@/store"
import router from "@/router"
import api from "."

// Authentication, authorization and tokens

export function isAuthenticated() {
  return localStorage.getItem("isAuthenticated") == "1"
}

export function reauthenticate() {
  const accessToken = localStorage.getItem("accessToken")
  axios.defaults.withCredentials = true
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
  // store.commit("invalidateDataCache")
  return api.orgstructure.userprofile().then((profile) => {
    store.commit("setProfile", profile)
  })
}

export function authenticate(tokens) {
  const accessToken = tokens.access
  const refreshToken = tokens.refresh
  localStorage.setItem("accessToken", accessToken)
  localStorage.setItem("refreshToken", refreshToken)
  localStorage.setItem("isAuthenticated", "1")
  axios.defaults.withCredentials = true
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
  // store.commit("invalidateDataCache")
  return api.orgstructure.userprofile().then((profile) => {
    store.commit("setProfile", profile)
  })
}

export function logout() {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("isAuthenticated")
  axios.defaults.withCredentials = false
  axios.defaults.headers.common["Authorization"] = ""
  store.commit("unsetProfile")
  // store.commit("invalidateDataCache")
  // store.commit("clearData")
}

export function refresh() {
  const REFRESH_URL = "/orgstructure/token-refresh/"
  const refreshToken = localStorage.getItem("refreshToken")
  if (refreshToken == null) {
    return Promise.reject()
  } else {
    return axios
      .post(REFRESH_URL, { refresh: refreshToken })
      .then((response) => {
        const tokens = { refresh: refreshToken, access: response.data.access }
        authenticate(tokens)
        return Promise.resolve(response)
      })
      .catch((error) => {
        logout()
        router.replace({ name: "LoginPage" })
        return Promise.reject(error)
      })
  }
}
