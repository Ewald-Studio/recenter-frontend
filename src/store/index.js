import Vue from "vue"
import Vuex from "vuex"

/* eslint-disable */

const MINUTE = 1000 * 60
const HOUR = MINUTE * 60
const MINUTES = MINUTE
const HOURS = HOUR

/* eslint-enable */

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    profile: null,
  },
  mutations: {
    setProfile(state, profile) {
      state.profile = profile
    },
    unsetProfile(state) {
      state.profile = null
    },
  },
  actions: {},
  modules: {},
})

// import api from "@/api"

// const cachedFetch = (
//   commitFunc,
//   lastValue,
//   lastUpdate,
//   cachePeriod,
//   apiHandler,
//   mutationName,
//   force = false
// ) => {
//   if (force || lastUpdate === null || new Date() - lastUpdate > cachePeriod) {
//     return apiHandler().then((data) => commitFunc(mutationName, data))
//   } else {
//     return Promise.resolve(lastValue)
//   }
// }

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
