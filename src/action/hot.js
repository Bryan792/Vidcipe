import { createAction } from 'redux-actions'
import _ from 'lodash'

import oldJson from '../final.json'

import realm from '../db-manager'

export const LOAD_HOT = 'LOAD_HOT'
export const LOAD_HOT_SUCCESS = 'LOAD_HOT_SUCCESS'
export const LOAD_HOT_APPEND_SUCCESS = 'LOAD_HOT_APPEND_SUCCESS'

export const SEARCH_SET = 'SEARCH_SET'

export const loadHotStart = createAction(LOAD_HOT)
export const loadHotSuccess = createAction(LOAD_HOT_SUCCESS)
export const loadHotAppendSuccess = createAction(LOAD_HOT_APPEND_SUCCESS)

export const search = createAction(SEARCH_SET)

export const loadHot = (append) => (dispatch, getState) => {
  if (getState().hot.get('isRefreshing')) return
  dispatch(loadHotStart())
  let url = 'https://www.reddit.com/r/gifrecipes.json?limit=50&raw_json=1' + (append ? `&after=${getState().hot.get('after')}` : '')


  fetch(url)
    .then(response => response.json())
    .then(response => {
      realm.write(() => {
        let data = response.data.children.map(post => post.data) 
        if (realm.objects('Post').length === 0) {
          console.log('empty filling')
          data = [...oldJson.hits.hits.map(post => post._source), ...data]
        }

        data
          .filter(post => !post.is_self)
          .filter(post => /.*gfycat.com/.test(post.domain) || /.*imgur.com/.test(post.domain))
          .forEach(post => {
            let thumbnail = _.get(post, 'preview.images[0].source')
            let {title, score, author, id, permalink, created_utc, url} = post
            realm.create('Post', {
              ...{title, score, author, id, permalink, url},
              created: new Date(created_utc),
              backupThumbnailUrl: post.thumbnail,
              thumbnailUrl: thumbnail ? thumbnail.url : post.thumbnail,
              thumbnailWidth: thumbnail ? thumbnail.width : -1,
              thumbnailHeight: thumbnail ? thumbnail.height : -1,
              comments: [],
            }, true);
          })
      });

      let action = append ? loadHotAppendSuccess : loadHotSuccess
      dispatch(action({
        posts: response.data.children,
        after: response.data.after,
      }))
    })
}
