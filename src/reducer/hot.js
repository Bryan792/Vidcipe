import Immutable from 'immutable'
import realm from '../db-manager'

import {
  LOAD_HOT,
  LOAD_HOT_SUCCESS,
  SEARCH_SET,
  RELOAD_HOT,
  SET_POST_DISPLAY,
} from '../action/hot'

const initialState = Immutable.fromJS({
  posts: realm.objects('Post').filtered('isHidden == false').sorted('created', true),
  isRefreshing: false,
  searchQuery: '',
  compact: true,
})

export default (state = initialState, action) => {
  function getPosts(searchQuery, filterFavorite) {
    let posts = realm.objects('Post')
    if (!filterFavorite && !searchQuery) {
      return initialState.get('posts')
    }
    if (filterFavorite) {
      posts = posts.filtered('favorite == true')
    }
    if (searchQuery) {
      posts = posts.filtered(`title CONTAINS[c] "${searchQuery}"`)
    }
    return posts.filtered('isHidden == false').sorted('score', true)
  }

  switch (action.type) {
    case LOAD_HOT:
      return state.set('isRefreshing', true)
    case LOAD_HOT_SUCCESS:
      return state
        .set('isRefreshing', false)
    case SEARCH_SET:
      return state
          .set('posts', getPosts(action.payload, state.get('filterFavorite')))
          .set('length', initialState.get('length'))
          .set('searchQuery', action.payload)
    case RELOAD_HOT:
      // TODO force anyone using this to reload, is this the best way?
      return state.set('reload', Date.now())
    case SET_POST_DISPLAY:
      return state.set('compact', action.payload)
    default:
      return state
  }
}
