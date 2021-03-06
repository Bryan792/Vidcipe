import { AsyncStorage } from 'react-native'
import { createAction } from 'redux-actions'
import _ from 'lodash'

import oldJson from '../final.json'

import realm from '../db-manager'

export const LOAD_HOT = 'LOAD_HOT'
export const LOAD_HOT_SUCCESS = 'LOAD_HOT_SUCCESS'

export const SEARCH_SET = 'SEARCH_SET'

export const RELOAD_HOT = 'RELOAD_HOT'

export const SET_POST_DISPLAY = 'SET_POST_DISPLAY'

export const loadHotStart = createAction(LOAD_HOT)
export const loadHotSuccess = createAction(LOAD_HOT_SUCCESS)

export const search = createAction(SEARCH_SET)

export const reloadHot = createAction(RELOAD_HOT)

export const setPostDisplay = createAction(SET_POST_DISPLAY)

export const loadHot = force => async (dispatch, getState) => {
  function getUrl(after) {
    return `https://www.reddit.com/r/gifrecipes/new/.json?limit=50&raw_json=1'${after ? `&after=${after}` : ''}`
  }

  if (getState().hot.get('isRefreshing')) return
  try {
    const value = await AsyncStorage.getItem('lastUpdated')
    let currentTime = Date.now()
    if (!force && value !== null && (currentTime - value) < 3.6e+6 && realm.objects('Post').length > 0) {
      return
    }

    dispatch(loadHotStart());

    (function getData(after) {
      return fetch(getUrl(after))
        .then(response => response.json())
        .then((response) => {
          let shouldContinue = true
          realm.write(() => {
            let data = response.data.children.map(post => post.data)
            if (realm.objects('Post').length === 0) {
              data = [...oldJson.hits.hits.map(post => post._source), ...data]
            }

            data
              .filter(post => !post.is_self)
              .filter(post => /.*gfycat.com/.test(post.domain) || /.*imgur.com/.test(post.domain))
              .forEach((post) => {
                let thumbnail = _.get(post, 'preview.images[0].source')
                let { title, score, author, id, permalink, created_utc, url } = post
                if (shouldContinue && realm.objectForPrimaryKey('Post', id)) {
                  shouldContinue = false
                }

                realm.create('Post', {
                  ...{
                    title,
                    score,
                    author,
                    id,
                    permalink,
                    url,
                  },
                  created: new Date(created_utc * 1000), // eslint-disable-line camelcase
                  backupThumbnailUrl: post.thumbnail,
                  thumbnailUrl: thumbnail ? thumbnail.url : post.thumbnail,
                  thumbnailWidth: thumbnail ? thumbnail.width : -1,
                  thumbnailHeight: thumbnail ? thumbnail.height : -1,
                  comments: [],
                }, true)
              })
          })

          dispatch(loadHotSuccess())

          if (shouldContinue) {
            return getData(response.data.after)
          }
          return AsyncStorage.setItem('lastUpdated', '' + currentTime) // eslint-disable-line
        })
    }())
  } catch (error) {
  // fail
  }
}

export const hidePost = post => (dispatch) => {
  realm.write(() => {
    post.isHidden = true
  })
  dispatch(reloadHot())
}

export const unhideAllPosts = () => (dispatch) => {
  realm.write(() => {
    realm.objects('Post').filtered('isHidden == true').forEach((post) => {
      if (post) post.isHidden = false
    })
  })
  dispatch(reloadHot())
}
