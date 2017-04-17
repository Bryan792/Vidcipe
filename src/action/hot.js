import { createAction } from 'redux-actions'

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
      let action = append ? loadHotAppendSuccess : loadHotSuccess
      dispatch(action({
        posts: response.data.children,
        after: response.data.after,
      }))
    })
}
