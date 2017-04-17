import Immutable from 'immutable'
import realm from '../db-manager'

import {
  LOAD_HOT,
  LOAD_HOT_SUCCESS,
  LOAD_HOT_APPEND_SUCCESS,
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
    default:
      return state
  }
}
