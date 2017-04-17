import { createAction } from 'redux-actions'
import _ from 'lodash'

import realm from '../db-manager'

export const LOAD_HOT = 'LOAD_HOT'
export const LOAD_HOT_SUCCESS = 'LOAD_HOT_SUCCESS'
export const LOAD_HOT_APPEND_SUCCESS = 'LOAD_HOT_APPEND_SUCCESS'

export const loadHotStart = createAction(LOAD_HOT)
export const loadHotSuccess = createAction(LOAD_HOT_SUCCESS)
export const loadHotAppendSuccess = createAction(LOAD_HOT_APPEND_SUCCESS)

export const loadHot = (append) => (dispatch, getState) => {
  if (getState().hot.get('isRefreshing')) return
  console.log('loading hot',append)
  dispatch(loadHotStart())
  let url = 'https://www.reddit.com/r/gifrecipes.json?limit=50&raw_json=1' + (append ? `&after=${getState().hot.get('after')}` : '')
  console.log(url)
  fetch(url)
    .then(response => response.json())
    .then(response => {
      realm.write(() => {
        response.data.children
          .map(post => post.data)
          .forEach(post => {
            let thumbnail = _.get(post, 'preview.images[0].source')
            let {title, score, author, id, permalink, created, url} = post
            realm.create('Post', {
              ...{title, score, author, id, permalink, url},
              created: new Date(created),
              thumbnailUrl: thumbnail ? thumbnail.url : post.thumbnail,
              thumbnailWidth: thumbnail ? thumbnail.width : -1,
              thumbnailHeight: thumbnail ? thumbnail.height : -1,
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
