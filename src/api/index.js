import { refresh, logout } from "./auth"
import axios from "axios"

function query(method, url, data, tryToRefresh = true) {
  var query_promise = null
  if (method == "get") {
    query_promise = axios.get(url)
  } else if (method == "post") {
    query_promise = axios.post(url, data)
  }
  return query_promise
    .then((response) => {
      return Promise.resolve(response.data)
    })
    .catch((error) => {
      if (error.response.status == 401 && tryToRefresh) {
        // console.log("Trying to refetch tokens")
        // Access token is seems to be invalid
        return refresh()
          .then(() => {
            return query(method, url, data, false)
          })
          .catch((error) => {
            logout()
            return Promise.reject(error)
          })
      }
      return Promise.reject(error)
    })
}

function get(url) {
  return query("get", url)
}

function post(url, data) {
  return query("post", url, data)
}

// API shortcuts

const api = {
  orgstructure: {
    login(username, password) {
      return post("/orgstructure/login/", {
        username: username,
        password: password,
      })
    },
    userprofile() {
      return get("/orgstructure/userprofile/")
    },
  },
  media: {
    articles() {
      return get("/media/articles/")
    },
  },
}

export default api
