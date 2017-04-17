import Immutable from 'immutable'
import realm from '../db-manager'

import {
  LOAD_HOT,
  LOAD_HOT_SUCCESS,
  LOAD_HOT_APPEND_SUCCESS,
  SEARCH_SET,
} from '../action/hot'

const initialState = Immutable.fromJS({
  posts: realm.objects('Post').sorted('created', true),
  isRefreshing: false,
})

export default (state = initialState, action) => {
  switch(action.type) {
    case LOAD_HOT:
      return state.set('isRefreshing', true)
    case LOAD_HOT_SUCCESS:
      return state
        .set('after', action.payload.after)
        .set('isRefreshing', false)
    case LOAD_HOT_APPEND_SUCCESS:
      return state
        .set('after', action.payload.after)
        .set('isRefreshing', false)
    case SEARCH_SET:
      if (action.payload)
        return state.set('posts', realm.objects('Post').sorted('score', true).filtered(`title CONTAINS[c] "${action.payload}"`))
      else
        return state.set('posts', initialState.get('posts'))
    default:
      return state
  }
}
