import Immutable from 'immutable'

import {
  LOAD_HOT,
  LOAD_HOT_SUCCESS,
  LOAD_HOT_APPEND_SUCCESS,
} from '../action/hot'

const initialState = Immutable.fromJS({
  isRefreshing: false,
})

export default (state = initialState, action) => {
  switch(action.type) {
    case LOAD_HOT:
      return state.set('isRefreshing', true)
    case LOAD_HOT_SUCCESS:
      return state
        .set('posts', action.payload.posts.filter(post => !post.data.is_self))
        .set('after', action.payload.after)
        .set('isRefreshing', false)
    case LOAD_HOT_APPEND_SUCCESS:
      return state
        .set('posts', [...state.get('posts'), ...action.payload.posts.filter(post => !post.data.is_self)])
        .set('after', action.payload.after)
        .set('isRefreshing', false)
    default:
      return state
  }
}
