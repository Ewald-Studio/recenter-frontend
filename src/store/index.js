import Vue from "vue"
import Vuex from "vuex"
import api from "@/api"
import axios from "axios"

Vue.use(Vuex)

/* eslint-disable */

const MINUTE = 1000 * 60
const HOUR = MINUTE * 60
const MINUTES = MINUTE
const HOURS = HOUR

/* eslint-enable */

const cachedFetch = (
  commitFunc,
  lastValue,
  lastUpdate,
  cachePeriod,
  apiHandler,
  mutationName,
  force = false,
) => {
  if (force || lastUpdate === null || new Date() - lastUpdate > cachePeriod) {
    return apiHandler().then((data) => commitFunc(mutationName, data))
  } else {
    return Promise.resolve(lastValue)
  }
}

export default new Vuex.Store({
  state: {
    userProfile: null,
    sections: null,
    sectionsLastUpdate: null,
    questions: null,
    questionsLastUpdate: null,
    autoFormSchemas: {},
  },
  mutations: {
    setProfile(state, profile) {
      state.userProfile = profile
    },
    unsetProfile(state) {
      state.userProfile = null
    },
    setSections(state, sections) {
      state.sections = sections
    },
    setQuestions(state, questions) {
      state.questions = questions
    },
    addAutoFormSchema(state, data) {
      state.autoFormSchemas[data.url] = data.schema
    },
  },
  actions: {
    fetchSections({ commit, state }) {
      return cachedFetch(
        commit,
        state.sections,
        state.sectionsLastUpdate,
        10 * MINUTES,
        api.media.sections,
        "setSections",
      )
    },
    fetchQuestions({ commit, state }) {
      return cachedFetch(
        commit,
        state.questions,
        state.questionsLastUpdate,
        10 * MINUTES,
        api.media.questions,
        "setQuestions",
      )
    },
    fetchFormSchema({ commit, state }, url) {
      if (!state.autoFormSchemas[url]) {
        return axios.options(url).then((response) => {
          commit("addAutoFormSchema", {
            url: url,
            schema: response.data.actions.POST,
          })
        })
      }
    },
  },
  modules: {},
})

// import api from "@/api"

// export default createStore({
//   state: {
//   },
//   mutations: {
//     },
//     // invalidateDataCache(state) {
//     //   state.articlesLastUpdate = null
//     //   state.coursesLastUpdate = null
//     //   state.videosLastUpdate = null
//     //   state.glossariumLastUpdate = null
//     //   state.portfolioListLastUpdate = null
//     // },
//     // clearData(state) {
//     //   state.currentLanguage = null
//     //   state.articles = null
//     //   state.courses = null
//     //   state.videos = null
//     //   state.glossarium = null
//     //   state.portfolioList = null
//     // },
//   },
//   actions: {
//     // fetchArticles({ commit, state }) {
//     //   return cachedFetch(
//     //     commit,
//     //     state.articles,
//     //     state.articlesLastUpdate,
//     //     10 * MINUTES,
//     //     api.media.articles,
//     //     "setArticles",
//     //   )
//     // },
//   },
// })
