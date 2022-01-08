import { refresh, logout } from "./auth"
import axios from "axios"

function query(method, url, data, tryToRefresh = true) {
  var query_promise = null
  if (method == "get") {
    query_promise = axios.get(url)
  } else if (method == "post") {
    query_promise = axios.post(url, data)
  } else if (method == "put") {
    query_promise = axios.put(url, data)
  } else if (method == "patch") {
    query_promise = axios.patch(url, data)
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

function patch(url, data) {
  return query("patch", url, data)
}

function put(url, data) {
  return query("put", url, data)
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
    getArticle(article_id) {
      return get("/media/articles/" + article_id + "/")
    },
    newArticle() {
      return post("/media/articles/")
    },
    saveArticle(article) {
      return put("/media/articles/" + article.id + "/", article)
    },
    sendToModeration(article_id) {
      return patch("/media/articles/" + article_id + "/", {
        status: "MODERATION",
      })
    },
    approveArticle(article_id) {
      return patch("/media/articles/" + article_id + "/", {
        status: "APPROVED",
        publish_date: new Date(),
      })
    },
    rejectArticle(article_id) {
      return patch("/media/articles/" + article_id + "/", {
        status: "REJECTED",
      })
    },
    deleteArticle(article_id) {
      return patch("/media/articles/" + article_id + "/", {
        status: "DELETED",
      })
    },
    sections() {
      return get("/media/sections/")
    },
    questions() {
      return get("/media/questions/")
    },
    newComment(comment) {
      return post("/media/comments/", {
        text: comment.text,
        article: comment.article,
      })
    },
  },
}

export default api
